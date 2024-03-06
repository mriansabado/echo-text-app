import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const Stack = createStackNavigator();

const BigWordApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="EchoText" component={HomeScreen} options={{ orientation: 'portrait' }} />
        <Stack.Screen name="BigWordScreen" component={BigWordScreen} options={{ orientation: 'landscape' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState(null);

  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const handleEnterPress = () => {
    navigation.navigate('BigWordScreen', { text, selectedAnimation });
  };

  const handleClearAll = () => {
    setText('');
  };

  const selectAnimation = (animation) => {
    setSelectedAnimation(animation);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={selectedAnimation === 'Animation1' ? styles.selectedButton : styles.button}
            onPress={() => selectAnimation('Animation1')}
          >
            <Text style={styles.buttonText}>Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedAnimation === 'Animation2' ? styles.selectedButton : styles.button}
            onPress={() => selectAnimation('Animation2')}
          >
            <Text style={styles.buttonText}>Warning</Text>
          </TouchableOpacity>
           <TouchableOpacity
            style={selectedAnimation === 'Animation3' ? styles.selectedButton : styles.button}
            onPress={() => selectAnimation('Animation3')}
          >
            <Text style={styles.buttonText}>Celebrate</Text>
          </TouchableOpacity>
           <TouchableOpacity
            style={selectedAnimation === 'Animation4' ? styles.selectedButton : styles.button}
            onPress={() => selectAnimation('Animation4')}
          >
            <Text style={styles.buttonText}>Check Mark</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={handleTextChange}
            value={text}
            placeholder="Type your text here"
          />
          {text !== '' && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleEnterPress}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const BigWordScreen = ({ route, navigation }) => {
  const { text, selectedAnimation } = route.params;

  return (
    <View style={styles.container}>
      {selectedAnimation === 'Animation1' && (
        <LottieView
          source={require('./assets/animations/Animation - 1709705128416.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      {selectedAnimation === 'Animation2' && (
        <LottieView
          source={require('./assets/animations/Animation - 1709707129524.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      {selectedAnimation === 'Animation3' && (
        <LottieView
          source={require('./assets/animations/Animation - 1708757997694.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      {selectedAnimation === 'Animation4' && (
        <LottieView
          source={require('./assets/animations/Animation - 1709707194363.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      {/* Add more conditions for additional animations as needed */}
      <Text style={styles.bigText}>{text}</Text>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to text</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f7e5e7',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginRight: 10,
  },
  clearButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  selectedButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'green',
  },
  bigText: {
    fontSize: 100,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
  },
  backButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  animation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 300,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
  },
});

export default BigWordApp;
