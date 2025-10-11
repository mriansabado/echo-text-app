import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Switch, Dimensions, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

const FontasticApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Fontastic" component={HomeScreen} />
        <Stack.Screen 
          name="FontasticResults" 
          component={FontasticScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#f7e5e7');
  const [showButtons, setShowButtons] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [sound, setSound] = useState();
  

  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    lockOrientation();

    return () => {
      subscription.remove();
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const playSound = async (soundFile) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };



  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  const handleEnterPress = () => {
    // playSound(require('./assets/sounds/submit.mp3')); // Uncomment when you add submit.mp3
    const resultsBackgroundColor = isNightMode ? '#1e3a8a' : backgroundColor;
    navigation.navigate('FontasticResults', { text, selectedAnimation, backgroundColor: resultsBackgroundColor });
  };

  const handleClearAll = () => {
    setText('');
  };

  const selectAnimation = (animation) => {
    setSelectedAnimation(selectedAnimation === animation ? null : animation);
  };


  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderThemeCards = () => {
    const themes = [
      { key: 'Hi', label: 'Wave', emoji: '👋', color: '#4CAF50' },
      { key: 'Alert', label: 'Alert', emoji: '⚠️', color: '#FF9800' },
      { key: 'Celebrate', label: 'Party', emoji: '🎉', color: '#E91E63' },
      { key: 'Happy', label: 'Happy', emoji: '😊', color: '#FFEB3B' },
      { key: 'Sad', label: 'Sad', emoji: '😢', color: '#2196F3' },
      { key: 'Thinking', label: 'Think', emoji: '🤔', color: '#9C27B0' },
      { key: 'Love', label: 'Love', emoji: '❤️', color: '#F44336' },
    ];

    return themes.map((theme) => (
      <TouchableOpacity
        key={theme.key}
        style={[
          styles.themeCard,
          selectedAnimation === theme.key && styles.selectedThemeCard,
          { borderColor: theme.color }
        ]}
        onPress={() => selectAnimation(theme.key)}
        accessibilityLabel={`Select ${theme.label} theme`}
      >
        <View style={[styles.themeEmoji, { backgroundColor: theme.color + '20' }]}>
          <Text style={styles.emojiText}>{theme.emoji}</Text>
          {selectedAnimation === theme.key && (
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark" size={16} color="#007AFF" />
            </View>
          )}
        </View>
        <Text style={[
          styles.themeLabel,
          selectedAnimation === theme.key && styles.selectedThemeLabel
        ]}>
          {theme.label}
        </Text>
      </TouchableOpacity>
    ));
  };

  const toggleNightMode = (value) => {
    console.log('Night mode toggled:', value);
    setIsNightMode(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      <LottieView
        source={isNightMode ? require('./assets/animations/Animation-Nighttime.json') : require('./assets/animations/Animation-Daytime.json')}
        autoPlay
        loop
        style={{
          position: 'absolute',
          width: dimensions.width + 100,
          height: dimensions.height + 150,
          top: -100,
          left: -50,
          right: -50,
          bottom: -50,
        }}
      />
      <KeyboardAvoidingView 
        style={[styles.contentContainer, { height: dimensions.height }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Night: {isNightMode ? 'ON' : 'OFF'}</Text>
          <TouchableOpacity 
            onPress={() => {
              console.log('Switch tapped, current state:', isNightMode);
              setIsNightMode(!isNightMode);
            }}
            style={styles.switchButton}
          >
            <View style={[styles.switchTrack, isNightMode && styles.switchTrackActive]}>
              <View style={[styles.switchThumb, isNightMode && styles.switchThumbActive]} />
            </View>
          </TouchableOpacity>
        </View>
          <View style={styles.logoContainer}>
            <Image 
              source={require('./assets/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <ScrollView 
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
            <View style={styles.themeSection}>
              <View style={styles.themeTitleContainer}>
                <Ionicons name="chevron-back" size={16} color="#666" />
                <Text style={[styles.themeSectionTitle, { color: isNightMode ? '#ffffff' : '#333' }]}>Choose Theme</Text>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.themeScrollContainer}
                decelerationRate="fast"
                snapToInterval={90}
                snapToAlignment="start"
                bounces={false}
              >
                {renderThemeCards()}
              </ScrollView>
            </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, isNightMode && styles.inputNightMode]}
                  onChangeText={handleTextChange}
                  value={text}
                  placeholder="Type your text here"
                  placeholderTextColor={isNightMode ? "#bbb" : "#666"} 
                  accessibilityHint="Enter your text to see animated results"
                />
                {text !== '' && (
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                    <Ionicons name="close" size={24} color={isNightMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleEnterPress}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
  );
};

const FontasticScreen = ({ route, navigation }) => {
  const { text, selectedAnimation, backgroundColor } = route.params;
  const [sound, setSound] = useState();
  
  // Determine if it's night mode based on background color
  const isNightMode = backgroundColor === '#1e3a8a';

  const playSound = async (soundFile) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  useEffect(() => {
    // Lock the screen to landscape mode when the component mounts
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
    // Play display sound when the large text shows
    // playSound(require('./assets/sounds/display.mp3'));

    // Unlock the screen orientation when the component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const calculateFontSize = (text) => {
    if (text.length <= 5) {
      return 100;
    } else {
      return Math.floor(500 / text.length);
    }
  };

  const animationSources = {
    Hi: require('./assets/animations/Animation - 1711149112180.json'),
    Alert: require('./assets/animations/Animation - 1709705128416.json'),
    Celebrate: require('./assets/animations/Animation - 1708757997694.json'),
    Happy: require('./assets/animations/happy.json'),
    Sad: require('./assets/animations/sad.json'),
    Thinking: require('./assets/animations/thinking.json'),
    Love: require('./assets/animations/love.json'),
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
      <ScrollView 
        vertical
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text numberOfLines={5} style={[styles.bigText, { color: isNightMode ? '#ffffff' : '#000000' }]} ellipsizeMode='clip'>{text}</Text>
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
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
  },
  switchContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 50,
    zIndex: 10,
    maxWidth: '30%',
  },
  switchText: {
    marginBottom: 5,
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  switchButton: {
    padding: 5,
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#767577',
    justifyContent: 'center',
    padding: 2,
  },
  switchTrackActive: {
    backgroundColor: '#81b0ff',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f4f3f4',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5dd4b',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 15,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputNightMode: {
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeSection: {
    width: '100%',
    marginBottom: 15,
  },
  themeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  themeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 8,
  },
  themeScrollContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  themeCard: {
    width: 80,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedThemeCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowOpacity: 0.4,
    elevation: 10,
    transform: [{ scale: 1.08 }],
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  themeEmoji: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 24,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedThemeLabel: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
  bigText: {
    fontSize: 100,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: 50,
    overflow: 'hidden',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: -40,
    paddingBottom: 80,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
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
});

export default FontasticApp;
