import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const Stack = createStackNavigator();

const BigWordApp = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="BigTex" component={HomeScreen} options={{ orientation: 'portrait' }} />
        <Stack.Screen name="BigTexResults" component={BigWordScreen} options={{ orientation: 'landscape' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#f7e5e7');
  const [showButtons, setShowButtons] = useState(false);

  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const handleEnterPress = () => {
    navigation.navigate('BigTexResults', { text, selectedAnimation, backgroundColor });
  };

  const handleClearAll = () => {
    setText('');
  };

  const selectAnimation = (animation) => {
    setSelectedAnimation(selectedAnimation === animation ? null : animation);
  };

  const toggleButtons = () => {
    setShowButtons(!showButtons);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderButtons = () => {
    return (
      <View style={styles.buttonContainer}>
         <TouchableOpacity
          style={selectedAnimation === 'Hello' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Hello')}
        >
          <Text style={styles.buttonText}>Hello</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'Alert' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Alert')}
        >
          <Text style={styles.buttonText}>Alert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'Celebrate' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Celebrate')}
        >
          <Text style={styles.buttonText}>Celebrate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'Warning' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('Warning')}
        >
          <Text style={styles.buttonText}>Warning</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedAnimation === 'CheckMark' ? styles.selectedButton : styles.button}
          onPress={() => selectAnimation('CheckMark')}
        >
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleButtons}>
          <Text style={styles.dropdownText}>Themes</Text>
        </TouchableOpacity>
        {showButtons && renderButtons()}
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
  const { text, selectedAnimation, backgroundColor } = route.params;

  const animationSources = {
    Hello: require('./assets/animations/Animation - 1711149112180.json'),
    Alert: require('./assets/animations/Animation - 1709705128416.json'),
    Celebrate: require('./assets/animations/Animation - 1708757997694.json'),
    Warning: require('./assets/animations/Animation - 1709707129524.json'),
    CheckMark: require('./assets/animations/Animation - 1709707194363.json'),
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {selectedAnimation && (
        <LottieView
          source={animationSources[selectedAnimation]}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      <ScrollView vertical>
        <Text style={styles.bigText}>{text}</Text>
      </ScrollView>
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '80%',
    gap: 10,
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
    backgroundColor: 'gray',
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
    left: '45%',
    width: 300,
    height: 200,
    marginLeft: -100,
    marginTop: -100,
  },
  dropdownButton: {
    marginBottom: 10,
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  dropdownText: {
    fontWeight: 'bold',
  },
});

export default BigWordApp;
