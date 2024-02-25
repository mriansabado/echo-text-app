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
  const [showAnimation, setShowAnimation] = useState(false); // State to control animation visibility

  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const handleEnterPress = () => {
    navigation.navigate('BigWordScreen', { text, showAnimation });
  };

  const handleClearAll = () => {
    setText('');
  };

  const toggleAnimation = () => {
    setShowAnimation(!showAnimation); // Toggle animation visibility
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.animationButton, showAnimation ? styles.animationButtonActive : styles.animationButtonInactive]}
          onPress={toggleAnimation}
        >
          <Text style={styles.animationButtonText}>Celebrate</Text>
        </TouchableOpacity>
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
  const { text, showAnimation } = route.params;

  return (
    <View style={styles.container}>
      {showAnimation && (
        <LottieView
          source={require('./assets/animations/Animation - 1708757997694.json')} // Adjust path accordingly
          autoPlay
          loop
          style={styles.animation}
        />
      )}
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
  animationButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  animationButtonActive: {
    backgroundColor: 'green',
  },
  animationButtonInactive: {
    backgroundColor: 'gray',
  },
  animationButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
