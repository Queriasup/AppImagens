
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, deleteObject, list } from "firebase/storage";



const AppImagens = () => {
  const [imageUri, setImageUri] = useState("https://previews.123rf.com/images/mironovak/mironovak1508/mironovak150800047/44239635-textura-de-tela-branca-ou-textura-de-padr%C3%A3o-de-grade-de-linho.jpg");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState([]);
  const [visible, setVisible] = useState(false);

  // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPk0VPwONVfsUJuTvLx0W1nERltOfUk9g",
  authDomain: "upload-imagens-28bf7.firebaseapp.com",
  projectId: "upload-imagens-28bf7",
  storageBucket: "upload-imagens-28bf7.appspot.com",
  messagingSenderId: "799934897518",
  appId: "1:799934897518:web:d234abc537192544ac757f"
};


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Armazena a imagem para o upload e exibe a imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.assets);
    }
  };

  function getRandom(max) {
    return Math.floor(Math.random() * max + 1)
  }


  //Método para realizar upload para o Firebase
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Selecione uma imagem antes de enviar.');
      return;
    }

    
    const storage = getStorage();

    var name = getRandom(200);
    
    const mountainsRef = ref(storage, name + '.jpg');

    const response = await fetch(imageUri);
    const blob = await response.blob();

    uploadBytes(mountainsRef, blob).then((snapshot) => {
      console.log(snapshot);
      alert('Imagem enviada com sucesso!!');
    });
  };

  async function LinkImage() {
    const storage = getStorage();
    const listRef = ref(storage);

    const firstPage = await list(listRef, { maxResults: 100 });
    var lista = [];
    firstPage.items.map((item) => {

      var link = ('https://firebasestorage.googleapis.com/v0/b/' +
        item.bucket + '/o/' + item.fullPath + '?alt=media');
      lista.push(link);

    })
    setImage(lista);
    setVisible(true);
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.link}</Text>
    </View>
  );

  const deleteItem = async (img) => {
    try{
      const storage = getStorage();
      const imageRef = ref(storage, img);
      await deleteObject(imageRef);
    } catch (erro){
      alert('Erro!!');
    } finally {
      alert('Operação de deleção realizada!!');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Escolher Imagem" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginVertical: 20 }} />}
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View> <Button title="Enviar Imagem" onPress={uploadImage} disabled={!imageUri} /></View>

      )}
      <View><Button title="Ver Imagens" onPress={LinkImage} /></View>
      <FlatList
        data={image}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ display: 'flex', flexDirection:'row', gap: 20, marginBottom: 20, alignItems: 'center' }}>
            <Image source={{ uri: item }} style={{ width: 150, height: 150 }} />
            <Button title="Deletar" onPress={() => deleteItem(item)} />
          </View>
        )}
      />

    </View>
  );
};




export default AppImagens;
