import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, ScrollView, Switch, Dimensions, KeyboardAvoidingView, Platform, Image, Animated, AppState, PanResponder, Modal } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { createAudioPlayer } from 'expo-audio';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const PocketSayApp = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // For now, just a small delay to ensure smooth transition
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        if (__DEV__) {
          console.warn('Error preparing app:', e);
        }
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animationEnabled: false }}>
        <Stack.Screen 
          name="PocketSay" 
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="PocketSayResults" 
          component={PocketSayScreen} 
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
  const [selectedBackground, setSelectedBackground] = useState('mountains');
  const [showButtons, setShowButtons] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [sound, setSound] = useState();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isThemeSectionExpanded, setIsThemeSectionExpanded] = useState(false);
  const [selectedFontStyle, setSelectedFontStyle] = useState('default');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gradientColors, setGradientColors] = useState(['#E8F4F8', '#F0E6F5']);
  const [buttonGradientColors, setButtonGradientColors] = useState(['#4A90E2', '#357ABD']);
  const fadeOpacity = React.useRef(new Animated.Value(0)).current;
  const gradientAnim = React.useRef(new Animated.Value(0)).current;
  const buttonGradientAnim = React.useRef(new Animated.Value(0)).current;
  

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

  // Helper function to interpolate between hex colors
  const interpolateColor = (color1, color2, factor) => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r1 = parseInt(hex1.slice(0, 2), 16);
    const g1 = parseInt(hex1.slice(2, 4), 16);
    const b1 = parseInt(hex1.slice(4, 6), 16);
    const r2 = parseInt(hex2.slice(0, 2), 16);
    const g2 = parseInt(hex2.slice(2, 4), 16);
    const b2 = parseInt(hex2.slice(4, 6), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Animate gradient background for theme button
  useEffect(() => {
    const colorSets = [
      ['#E8F4F8', '#F0E6F5'], // Light blue to light purple
      ['#F0E6F5', '#FFE5E5'], // Light purple to light pink
      ['#FFE5E5', '#FFF5E1'], // Light pink to light peach
      ['#FFF5E1', '#E8F4F8'], // Light peach back to light blue
    ];

    const listener = gradientAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      
      setGradientColors([color1, color2]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(gradientAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          }),
          Animated.timing(gradientAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      gradientAnim.removeListener(listener);
    };
  }, []);

  // Animate button gradient background
  useEffect(() => {
    const colorSets = [
      ['#4A90E2', '#357ABD'], // Blue shades
      ['#5B9BD5', '#4A90E2'], // Lighter blue
      ['#357ABD', '#2E6DA4'], // Darker blue
      ['#4A90E2', '#357ABD'], // Back to start
    ];

    const listener = buttonGradientAnim.addListener(({ value }) => {
      const index = Math.floor(value * (colorSets.length - 1));
      const nextIndex = Math.min(index + 1, colorSets.length - 1);
      const progress = (value * (colorSets.length - 1)) - index;
      
      // Interpolate between color sets
      const color1 = interpolateColor(colorSets[index][0], colorSets[nextIndex][0], progress);
      const color2 = interpolateColor(colorSets[index][1], colorSets[nextIndex][1], progress);
      
      setButtonGradientColors([color1, color2]);
    });

    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGradientAnim, {
            toValue: 1,
            duration: 6000, // Slow 6 second transition
            useNativeDriver: false,
          }),
          Animated.timing(buttonGradientAnim, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    
    startAnimation();
    
    return () => {
      buttonGradientAnim.removeListener(listener);
    };
  }, []);


  const playSound = async (soundFile) => {
    try {
      const player = createAudioPlayer(soundFile);
      setSound(player);
      player.play();
    } catch (error) {
      if (__DEV__) {
        console.log('Error playing sound:', error);
      }
    }
  };



  const handleTextChange = (inputText) => {
    // Only allow text changes if under 68 characters or if deleting characters
    if (inputText.length <= 68) {
      setText(inputText);
    }
  };

  const handleEnterPress = () => {
    // playSound(require('./assets/sounds/submit.mp3')); // Uncomment when you add submit.mp3
    const resultsBackgroundColor = isNightMode ? '#1e3a8a' : backgroundColor;
    transitionToResults(resultsBackgroundColor);
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

  const waitForOrientation = async (desired) => {
    const current = await ScreenOrientation.getOrientationAsync();
    const isLandscapeDesired = desired === 'LANDSCAPE';
    const isPortraitDesired = desired === 'PORTRAIT';
    if (
      (isLandscapeDesired && (current === ScreenOrientation.Orientation.LANDSCAPE_LEFT || current === ScreenOrientation.Orientation.LANDSCAPE_RIGHT)) ||
      (isPortraitDesired && (current === ScreenOrientation.Orientation.PORTRAIT_UP || current === ScreenOrientation.Orientation.PORTRAIT_DOWN))
    ) {
      return;
    }
    return new Promise((resolve) => {
      const sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
        const o = orientationInfo.orientation;
        if (
          (isLandscapeDesired && (o === ScreenOrientation.Orientation.LANDSCAPE_LEFT || o === ScreenOrientation.Orientation.LANDSCAPE_RIGHT)) ||
          (isPortraitDesired && (o === ScreenOrientation.Orientation.PORTRAIT_UP || o === ScreenOrientation.Orientation.PORTRAIT_DOWN))
        ) {
          ScreenOrientation.removeOrientationChangeListener(sub);
          resolve();
        }
      });
    });
  };

  // Background configurations with day/night modes
  const backgroundConfigs = {
    mountains: {
      name: 'Mountains',
      type: 'lottie',
      day: require('./assets/animations/Animation-Daytime.json'),
      night: require('./assets/animations/Animation-Nighttime.json'),
      previewColor: '#E8F4F8',
    },
    ocean: {
      name: 'Ocean Breeze',
      type: 'gradient',
      day: { colors: ['#87CEEB', '#E0F6FF', '#B0E0E6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      night: { colors: ['#001F3F', '#003366', '#004080'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      previewColor: '#87CEEB',
    },
    sunset: {
      name: 'Sunset Glow',
      type: 'gradient',
      day: { colors: ['#FF6B6B', '#FFE66D', '#FF8C42'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      night: { colors: ['#2C1810', '#4A2C2A', '#6B4423'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      previewColor: '#FF6B6B',
    },
    forest: {
      name: 'Forest Calm',
      type: 'gradient',
      day: { colors: ['#90EE90', '#C8E6C9', '#A5D6A7'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      night: { colors: ['#1B4332', '#2D5016', '#081C15'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      previewColor: '#90EE90',
    },
    lavender: {
      name: 'Lavender Dreams',
      type: 'gradient',
      day: { colors: ['#E6E6FA', '#DDA0DD', '#DA70D6'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      night: { colors: ['#2D1B3D', '#4A2C4A', '#6B3E6B'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
      previewColor: '#E6E6FA',
    },
    minimal: {
      name: 'Minimal Light',
      type: 'solid',
      day: { color: '#F5F5F5' },
      night: { color: '#1A1A1A' },
      previewColor: '#F5F5F5',
    },
  };

  const transitionToResults = async (resultsBackgroundColor) => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } catch (e) {
      if (__DEV__) {
        console.log('Orientation lock failed (continuing):', e);
      }
    } finally {
      navigation.navigate('PocketSayResults', { text, selectedAnimation, backgroundColor: resultsBackgroundColor, fontStyle: selectedFontStyle, backgroundType: selectedBackground });
    }
  };

  // Font styles mapping - Distinctive, modern fonts that stand out
  const fontStyles = {
    default: { 
      name: 'Default', 
      fontFamily: undefined, 
      fontWeight: 'bold', 
      fontStyle: 'normal',
      letterSpacing: 0,
      textTransform: 'none'
    },
    modern: { 
      name: 'Modern', 
      fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
      fontWeight: '600', 
      fontStyle: 'normal', 
      letterSpacing: 2,
      textTransform: 'uppercase'
    },
    sleek: { 
      name: 'Sleek', 
      fontFamily: undefined,
      fontWeight: '200', 
      fontStyle: 'normal', 
      letterSpacing: 3,
      textTransform: 'none'
    },
    cartoon: { 
      name: 'Cartoon', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    elegant: { 
      name: 'Elegant', 
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontWeight: '400', 
      fontStyle: 'italic', 
      letterSpacing: 1.5,
      textTransform: 'none'
    },
    futuristic: { 
      name: 'Futuristic', 
      fontFamily: undefined,
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 2.5,
      textTransform: 'uppercase'
    },
    handwritten: { 
      name: 'Handwritten', 
      fontFamily: Platform.OS === 'ios' ? 'Chalkduster' : 'cursive',
      fontWeight: '400', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    retro: { 
      name: 'Retro', 
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    },
    minimalist: { 
      name: 'Minimalist', 
      fontFamily: undefined,
      fontWeight: '300', 
      fontStyle: 'normal',
      letterSpacing: 4,
      textTransform: 'lowercase'
    },
    bold: { 
      name: 'Bold', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: -0.5,
      textTransform: 'none'
    },
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
          isNightMode && styles.themeCardNight,
          selectedAnimation === theme.key && styles.selectedThemeCard,
          selectedAnimation === theme.key && isNightMode && styles.selectedThemeCardNight,
          { borderColor: theme.color }
        ]}
        onPress={() => selectAnimation(theme.key)}
        accessibilityLabel={`Select ${theme.label} theme`}
      >
        <View style={[styles.themeEmoji, { backgroundColor: theme.color + '20' }]}>
          <Text style={styles.emojiText}>{theme.emoji}</Text>
          {selectedAnimation === theme.key && (
            <View style={[
              styles.checkmarkContainer,
              isNightMode && styles.checkmarkContainerNight
            ]}>
              <Ionicons name="checkmark" size={16} color={isNightMode ? "#81b0ff" : "#007AFF"} />
            </View>
          )}
        </View>
        <Text style={[
          styles.themeLabel,
          isNightMode && styles.themeLabelNight,
          selectedAnimation === theme.key && styles.selectedThemeLabel,
          selectedAnimation === theme.key && isNightMode && styles.selectedThemeLabelNight
        ]}>
          {theme.label}
        </Text>
      </TouchableOpacity>
    ));
  };

  const toggleNightMode = (value) => {
    if (__DEV__) {
      console.log('Night mode toggled:', value);
    }
    setIsNightMode(value);
  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: isNightMode ? '#000000' : 'transparent' }]} edges={['top']}>
        <StatusBar style="dark" />
      {/* Background rendering based on selected type */}
      {backgroundConfigs[selectedBackground].type === 'lottie' && (
        <LottieView
          source={isNightMode ? backgroundConfigs[selectedBackground].night : backgroundConfigs[selectedBackground].day}
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
      )}
      {backgroundConfigs[selectedBackground].type === 'gradient' && (
        <LinearGradient
          colors={isNightMode ? backgroundConfigs[selectedBackground].night.colors : backgroundConfigs[selectedBackground].day.colors}
          start={isNightMode ? backgroundConfigs[selectedBackground].night.start : backgroundConfigs[selectedBackground].day.start}
          end={isNightMode ? backgroundConfigs[selectedBackground].night.end : backgroundConfigs[selectedBackground].day.end}
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      {backgroundConfigs[selectedBackground].type === 'solid' && (
        <View
          style={{
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isNightMode ? backgroundConfigs[selectedBackground].night.color : backgroundConfigs[selectedBackground].day.color,
          }}
        />
      )}
      <KeyboardAvoidingView 
        style={[styles.contentContainer, { height: dimensions.height }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
          <TouchableWithoutFeedback onPress={() => {
            dismissKeyboard();
            setShowFontDropdown(false);
            setIsThemeSectionExpanded(false);
          }}>
            <ScrollView 
              contentContainerStyle={styles.mainContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.inputContainer}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>{isNightMode ? '🌙' : '☀️'}</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      if (__DEV__) {
                        console.log('Switch tapped, current state:', isNightMode);
                      }
                      setIsNightMode(!isNightMode);
                    }}
                    style={styles.switchButton}
                  >
                    <View style={[styles.switchTrack, isNightMode && styles.switchTrackActive]}>
                      <View style={[styles.switchThumb, isNightMode && styles.switchThumbActive]} />
                    </View>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.input, 
                    isNightMode && styles.inputNightMode,
                    text.length >= 68 && styles.inputLimitReached
                  ]}
                  onChangeText={handleTextChange}
                  value={text}
                  placeholder="Type your text here"
                  placeholderTextColor={isNightMode ? "#bbb" : "#666"} 
                  accessibilityHint="Enter your text to see animated results"
                  maxLength={68}
                  multiline={true}
                />
                {text.length > 0 && (
                  <Text style={[
                    styles.characterCount, 
                    isNightMode && styles.characterCountNight,
                    text.length >= 68 && styles.characterCountLimitReached
                  ]}>
                    {text.length}/68
                  </Text>
                )}
                {text !== '' && (
                  <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                    <Ionicons name="close" size={24} color={isNightMode ? "#fff" : "#000"} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={handleEnterPress} activeOpacity={0.8}>
                <LinearGradient
                  colors={buttonGradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.buttonText}>Display</Text>
                </LinearGradient>
              </TouchableOpacity>
            <View style={styles.themeSection}>
              <View style={styles.themeButtonRow}>
                <TouchableOpacity 
                  onPress={() => setIsThemeSectionExpanded(!isThemeSectionExpanded)}
                  activeOpacity={0.8}
                  style={styles.themeButtonWrapper}
                >
                  <LinearGradient
                    colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.themeTitleContainer,
                      isNightMode && styles.themeTitleContainerNight
                    ]}
                  >
                    <Text style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Theme</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setShowFontDropdown(!showFontDropdown);
                    setIsThemeSectionExpanded(false);
                  }}
                  activeOpacity={0.8}
                  style={styles.themeButtonWrapper}
                >
                  <LinearGradient
                    colors={isNightMode ? ['#2a2a2a', '#1a1a1a'] : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.themeTitleContainer,
                      isNightMode && styles.themeTitleContainerNight
                    ]}
                  >
                    <Text style={[styles.themeSectionTitle, { color: isNightMode ? '#f0f0f0' : '#1a1a1a' }]}>Font</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              {showFontDropdown && (
                <TouchableWithoutFeedback onPress={() => {}}>
                  <View style={[
                    styles.fontDropdown,
                    isNightMode && styles.fontDropdownNight
                  ]}>
                    <ScrollView 
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.fontDropdownContent}
                      nestedScrollEnabled={true}
                    >
                      {Object.entries(fontStyles).map(([key, style]) => (
                        <TouchableOpacity
                          key={key}
                          onPress={() => {
                            setSelectedFontStyle(key);
                            setShowFontDropdown(false);
                          }}
                          activeOpacity={0.7}
                          style={[
                            styles.fontButton,
                            isNightMode && styles.fontButtonNight,
                            selectedFontStyle === key && styles.selectedFontButton,
                            selectedFontStyle === key && isNightMode && styles.selectedFontButtonNight
                          ]}
                        >
                          <Text 
                            style={[
                              styles.fontButtonText,
                              isNightMode && styles.fontButtonTextNight,
                              selectedFontStyle === key && styles.selectedFontButtonText,
                              {
                                fontFamily: style.fontFamily,
                                fontWeight: style.fontWeight,
                                fontStyle: style.fontStyle,
                                letterSpacing: style.letterSpacing,
                                textTransform: style.textTransform,
                              }
                            ]}
                            numberOfLines={1}
                          >
                            {style.name}
                          </Text>
                          {selectedFontStyle === key && (
                            <View style={[
                              styles.fontCheckmarkContainer,
                              isNightMode && styles.fontCheckmarkContainerNight
                            ]}>
                              <Ionicons 
                                name="checkmark" 
                                size={14} 
                                color="#FFFFFF"
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              )}
              {isThemeSectionExpanded && (
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
              )}
            </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        {/* Settings button */}
        <TouchableOpacity
          style={[
            styles.settingsButton,
            isNightMode && styles.settingsButtonNight
          ]}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={isNightMode ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
        {/* Settings Modal */}
        <Modal
          visible={showSettings}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSettings(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowSettings(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[
                  styles.settingsModal,
                  isNightMode && styles.settingsModalNight
                ]}>
                  <View style={[
                    styles.settingsHeader,
                    isNightMode && styles.settingsHeaderNight
                  ]}>
                    <Text style={[
                      styles.settingsTitle,
                      isNightMode && styles.settingsTitleNight
                    ]}>
                      Settings
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowSettings(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons 
                        name="close" 
                        size={24} 
                        color={isNightMode ? '#ffffff' : '#000000'} 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.settingsContent}>
                    {/* Background Options Section */}
                    <View style={styles.settingsSection}>
                      <Text style={[
                        styles.settingsSectionTitle,
                        isNightMode && styles.settingsSectionTitleNight
                      ]}>
                        Backgrounds
                      </Text>
                      <View style={styles.backgroundGrid}>
                        {Object.entries(backgroundConfigs).map(([key, config]) => (
                          <TouchableOpacity
                            key={key}
                            onPress={() => {
                              setSelectedBackground(key);
                              setShowSettings(false);
                            }}
                            style={[
                              styles.backgroundOption,
                              selectedBackground === key && styles.backgroundOptionSelected
                            ]}
                          >
                            {config.type === 'lottie' ? (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <LottieView
                                  source={isNightMode ? config.night : config.day}
                                  autoPlay
                                  loop
                                  style={styles.backgroundLottiePreview}
                                />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            ) : config.type === 'gradient' ? (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <LinearGradient
                                  colors={isNightMode ? config.night.colors : config.day.colors}
                                  start={isNightMode ? config.night.start : config.day.start}
                                  end={isNightMode ? config.night.end : config.day.end}
                                  style={styles.backgroundGradientPreview}
                                />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View style={[
                                styles.backgroundPreview,
                                selectedBackground === key && { borderColor: '#007AFF' }
                              ]}>
                                <View style={[
                                  styles.backgroundGradientPreview,
                                  { backgroundColor: isNightMode ? config.night.color : config.day.color }
                                ]} />
                                {selectedBackground === key && (
                                  <View style={styles.backgroundCheckmark}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                  </View>
                                )}
                              </View>
                            )}
                            <Text style={[
                              styles.backgroundOptionLabel,
                              isNightMode && styles.backgroundOptionLabelNight
                            ]}>
                              {config.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    
                    {/* Future customizations can be added here */}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {/* Removed pre-navigation black overlay to avoid initial black-screen stall */}
      </SafeAreaView>
      <SafeAreaView edges={['bottom']} style={styles.bottomSafeAreaContainer} />
    </View>
  );
};

const PocketSayScreen = ({ route, navigation }) => {
  const { text, selectedAnimation, backgroundColor, fontStyle = 'default' } = route.params;
  const [sound, setSound] = useState();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fadeOpacity = React.useRef(new Animated.Value(1)).current;
  const [winDims, setWinDims] = useState(Dimensions.get('window'));
  
  // Determine initial night mode based on background color, then allow toggling
  const [isNightMode, setIsNightMode] = useState(backgroundColor === '#1e3a8a');
  // Store the original light mode color (default to '#f7e5e7' if we started in night mode)
  const originalLightColor = backgroundColor === '#1e3a8a' ? '#f7e5e7' : backgroundColor;
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);
  
  // Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  // Font styles mapping (same as HomeScreen)
  const fontStyles = {
    default: { 
      name: 'Default', 
      fontFamily: undefined, 
      fontWeight: 'bold', 
      fontStyle: 'normal',
      letterSpacing: 0,
      textTransform: 'none'
    },
    modern: { 
      name: 'Modern', 
      fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
      fontWeight: '600', 
      fontStyle: 'normal', 
      letterSpacing: 2,
      textTransform: 'uppercase'
    },
    sleek: { 
      name: 'Sleek', 
      fontFamily: undefined,
      fontWeight: '200', 
      fontStyle: 'normal', 
      letterSpacing: 3,
      textTransform: 'none'
    },
    cartoon: { 
      name: 'Cartoon', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    elegant: { 
      name: 'Elegant', 
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
      fontWeight: '400', 
      fontStyle: 'italic', 
      letterSpacing: 1.5,
      textTransform: 'none'
    },
    futuristic: { 
      name: 'Futuristic', 
      fontFamily: undefined,
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 2.5,
      textTransform: 'uppercase'
    },
    handwritten: { 
      name: 'Handwritten', 
      fontFamily: Platform.OS === 'ios' ? 'Chalkduster' : 'cursive',
      fontWeight: '400', 
      fontStyle: 'normal',
      letterSpacing: 1,
      textTransform: 'none'
    },
    retro: { 
      name: 'Retro', 
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      fontWeight: '700', 
      fontStyle: 'normal',
      letterSpacing: 1.5,
      textTransform: 'uppercase'
    },
    minimalist: { 
      name: 'Minimalist', 
      fontFamily: undefined,
      fontWeight: '300', 
      fontStyle: 'normal',
      letterSpacing: 4,
      textTransform: 'lowercase'
    },
    bold: { 
      name: 'Bold', 
      fontFamily: undefined,
      fontWeight: '900', 
      fontStyle: 'normal',
      letterSpacing: -0.5,
      textTransform: 'none'
    },
  };

  const selectedFont = fontStyles[fontStyle] || fontStyles.default;

  const playSound = async (soundFile) => {
    try {
      const player = createAudioPlayer(soundFile);
      setSound(player);
      player.play();
    } catch (error) {
      if (__DEV__) {
        console.log('Error playing sound:', error);
      }
    }
  };

  useEffect(() => {
    // Ensure the screen is in landscape; if already locked, this is a no-op
    const lockAndUpdateDims = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      // Update dimensions after orientation change
      setTimeout(() => {
        setWinDims(Dimensions.get('window'));
      }, 100);
    };
    lockAndUpdateDims();
    
    // Play display sound when the large text shows
    // playSound(require('./assets/sounds/display.mp3'));

    // Do not unlock on unmount to avoid a second flip; the caller handles locking back
    return () => {};
  }, []);

  useEffect(() => {
    // Fade in on mount for a smooth reveal
    Animated.timing(fadeOpacity, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, []);

  // Ensure no header appears on results screen
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => setWinDims(window));
    return () => {
      sub.remove();
    };
  }, []);

  const calculateFontSize = (text) => {
    if (text.length <= 5) {
      return 100;
    } else {
      return Math.floor(500 / text.length);
    }
  };

  const toggleNightMode = (value) => {
    setIsNightMode(value);
    setCurrentBackgroundColor(value ? '#1e3a8a' : originalLightColor);
  };

  // Drawing handlers
  const drawingOverlayRef = useRef(null);
  
  const shouldCaptureTouch = (event) => {
    // Don't capture touches in button areas (bottom corners)
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = winDims.width;
    const screenHeight = winDims.height;
    
    // Bottom left area (back button) - approximately 150x100px area
    if (pageX < 150 && pageY > screenHeight - 100) {
      return false;
    }
    
    // Bottom right area (brush/eraser/night mode buttons) - approximately 200x100px area
    if (pageX > screenWidth - 200 && pageY > screenHeight - 100) {
      return false;
    }
    
    return true;
  };
  
  const handleTouchStart = (event) => {
    if (!isDrawingMode) return;
    if (!shouldCaptureTouch(event)) return;
    const { locationX, locationY } = event.nativeEvent;
    const newPath = [{ x: locationX, y: locationY }];
    setCurrentPath(newPath);
  };

  const handleTouchMove = (event) => {
    if (!isDrawingMode || currentPath.length === 0) return;
    const { locationX, locationY } = event.nativeEvent;
    const lastPoint = currentPath[currentPath.length - 1];
    const distance = Math.sqrt(
      Math.pow(locationX - lastPoint.x, 2) + Math.pow(locationY - lastPoint.y, 2)
    );
    // Add point only if moved enough to create smooth lines
    if (distance > 1) {
      setCurrentPath([...currentPath, { x: locationX, y: locationY }]);
    }
  };

  // Convert points to smooth SVG path using smooth quadratic bezier curves
  const pointsToPath = (points) => {
    if (points.length < 2) return '';
    if (points.length === 2) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const currentPoint = points[i];
      const prevPoint = points[i - 1];
      
      if (i === 1) {
        // First segment - use line to second point
        path += ` L ${currentPoint.x} ${currentPoint.y}`;
      } else {
        // Use smooth quadratic bezier curves
        // Control point is the previous point
        // End point is the midpoint between previous and current for smooth transition
        const midX = (prevPoint.x + currentPoint.x) / 2;
        const midY = (prevPoint.y + currentPoint.y) / 2;
        path += ` Q ${prevPoint.x} ${prevPoint.y} ${midX} ${midY}`;
        
        // Draw line to the actual current point if it's the last point
        if (i === points.length - 1) {
          path += ` L ${currentPoint.x} ${currentPoint.y}`;
        }
      }
    }
    
    return path;
  };

  const handleTouchEnd = () => {
    if (!isDrawingMode || currentPath.length === 0) return;
    setDrawingPaths([...drawingPaths, [...currentPath]]);
    setCurrentPath([]);
  };

  const clearDrawing = () => {
    setDrawingPaths([]);
    setCurrentPath([]);
  };

  const animationSources = {
    Hi: require('./assets/animations/hand wave.json'),
    Alert: require('./assets/animations/Animation - 1709705128416.json'),
    Celebrate: require('./assets/animations/Animation - 1708757997694.json'),
    Happy: require('./assets/animations/happy.json'),
    Sad: require('./assets/animations/sad.json'),
    Thinking: require('./assets/animations/thinking.json'),
    Love: require('./assets/animations/love.json'),
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentBackgroundColor }]} edges={['left', 'right', 'top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          (() => {
            if (!selectedAnimation) return null;
            const hasText = !!(text && text.trim() !== '');
            if (!hasText) return null; // theme-only uses centered overlay
            const base = Math.floor(Math.min(winDims.width, winDims.height) * 0.4);
            const width = Math.max(260, Math.min(base, 420));
            return { paddingRight: width + 40 };
          })()
        ]}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Text 
          numberOfLines={5} 
          style={[
            styles.bigText, 
            { 
              color: isNightMode ? '#ffffff' : '#000000',
              fontFamily: selectedFont.fontFamily,
              fontWeight: selectedFont.fontWeight,
              fontStyle: selectedFont.fontStyle,
              letterSpacing: selectedFont.letterSpacing,
            }
          ]} 
          ellipsizeMode='clip'
        >
          {selectedFont.textTransform === 'uppercase' 
            ? text.toUpperCase() 
            : selectedFont.textTransform === 'lowercase' 
            ? text.toLowerCase() 
            : text}
        </Text>
      </ScrollView>
      
      {selectedAnimation && (
        (!text || text.trim() === '') ? (
          <View pointerEvents="none" style={styles.animationCenteredContainer}>
            {(() => {
              const baseSize = Math.floor(Math.min(winDims.width, winDims.height) * 0.85);
              const width = baseSize;
              const height = Math.floor(baseSize * 0.75); // keep 4:3 like previous 200x150
              return (
                <LottieView
                  source={animationSources[selectedAnimation]}
                  autoPlay
                  loop
                  style={[styles.animationCentered, { width, height }]}
                />
              );
            })()}
          </View>
        ) : (
          (() => {
            const base = Math.floor(Math.min(winDims.width, winDims.height) * 0.4);
            const width = Math.max(260, Math.min(base, 420));
            const height = Math.floor(width * 0.75);
            return (
              <LottieView
                source={animationSources[selectedAnimation]}
                autoPlay
                loop
                style={[styles.animation, { width, height, marginTop: -height / 2 }]}
              />
            );
          })()
        )
      )}
      
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={async () => {
          try {
            setIsTransitioning(true);
            Animated.timing(fadeOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            // Wait for portrait before navigating back
            const waitForPortrait = () => new Promise((resolve) => {
              ScreenOrientation.getOrientationAsync().then((o) => {
                if (o === ScreenOrientation.Orientation.PORTRAIT_UP || o === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
                  resolve();
                } else {
                  const sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
                    const oo = orientationInfo.orientation;
                    if (oo === ScreenOrientation.Orientation.PORTRAIT_UP || oo === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
                      ScreenOrientation.removeOrientationChangeListener(sub);
                      resolve();
                    }
                  });
                }
              });
            });
            await waitForPortrait();
          } catch (e) {
            if (__DEV__) {
              console.log('Transition back failed:', e);
            }
          } finally {
            navigation.goBack();
          }
        }}>
          <Text style={styles.backButtonText}>Back to text</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.resultsSwitchContainer}>
        <TouchableOpacity
          onPress={() => setIsDrawingMode(!isDrawingMode)}
          style={[
            styles.brushButton,
            isDrawingMode && styles.brushButtonActive,
            isNightMode && styles.brushButtonNight,
            isDrawingMode && isNightMode && styles.brushButtonActiveNight
          ]}
        >
          <Ionicons 
            name="brush" 
            size={20} 
            color={isDrawingMode 
              ? (isNightMode ? '#81b0ff' : '#007AFF')
              : (isNightMode ? '#ffffff' : '#000000')
            } 
          />
        </TouchableOpacity>
        {isDrawingMode && (
          <TouchableOpacity
            onPress={clearDrawing}
            style={[
              styles.eraserButton,
              isNightMode && styles.eraserButtonNight
            ]}
          >
            <Ionicons 
              name="trash-outline" 
              size={18} 
              color={isNightMode ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
        )}
        <Text style={[styles.resultsSwitchText, { color: isNightMode ? '#ffffff' : '#000000' }]}>{isNightMode ? '🌙' : '☀️'}</Text>
        <TouchableOpacity 
          onPress={() => {
            if (__DEV__) {
              console.log('Results switch tapped, current state:', isNightMode);
            }
            toggleNightMode(!isNightMode);
          }}
          style={styles.switchButton}
        >
          <View style={[styles.switchTrack, isNightMode && styles.switchTrackActive]}>
            <View style={[styles.switchThumb, isNightMode && styles.switchThumbActive]} />
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Drawing overlay */}
      {isDrawingMode && (
        <View
          ref={drawingOverlayRef}
          style={styles.drawingOverlay}
          pointerEvents="box-none"
        >
          <View
            style={styles.drawingTouchArea}
            onStartShouldSetResponder={(evt) => shouldCaptureTouch(evt)}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleTouchStart}
            onResponderMove={handleTouchMove}
            onResponderRelease={handleTouchEnd}
          >
            <Svg
              style={styles.svgContainer}
              width={winDims.width}
              height={winDims.height}
            >
              {/* Render completed paths with bright neon orange glow */}
              {drawingPaths.map((path, pathIndex) => {
                if (path.length < 2) return null;
                const pathData = pointsToPath(path);
                return (
                  <React.Fragment key={pathIndex}>
                    {/* Outer glow layer - largest, most transparent */}
                    <Path
                      d={pathData}
                      stroke="#FF6600"
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.25"
                    />
                    {/* Middle glow layer */}
                    <Path
                      d={pathData}
                      stroke="#FF6600"
                      strokeWidth="18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.5"
                    />
                    {/* Inner bright neon line */}
                    <Path
                      d={pathData}
                      stroke="#FF6600"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Core bright orange line */}
                    <Path
                      d={pathData}
                      stroke="#FF8800"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="1"
                    />
                  </React.Fragment>
                );
              })}
              {/* Render current path being drawn with bright neon orange glow */}
              {currentPath.length > 1 && (
                <React.Fragment>
                  {/* Outer glow layer - largest, most transparent */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF6600"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.25"
                  />
                  {/* Middle glow layer */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF6600"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.5"
                  />
                  {/* Inner bright neon line */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF6600"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.85"
                  />
                  {/* Core bright orange line */}
                  <Path
                    d={pointsToPath(currentPath)}
                    stroke="#FF8800"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="1"
                  />
                </React.Fragment>
              )}
            </Svg>
          </View>
        </View>
      )}
      {isTransitioning && (
        <Animated.View pointerEvents="none" style={[styles.fadeOverlay, { opacity: fadeOpacity }]} />
      )}
    </SafeAreaView>
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
    paddingTop: 100,
    paddingBottom: 50,
  },
  switchContainer: {
    position: 'absolute',
    top: -40,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  switchText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginRight: 5,
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
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 80,
    textAlignVertical: 'top',
  },
  inputNightMode: {
    color: '#fff',
    borderColor: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  inputLimitReached: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    bottom: 5,
    padding: 5,
  },
  characterCount: {
    position: 'absolute',
    right: 50,
    bottom: 5,
    fontSize: 12,
    color: '#666',
  },
  characterCountNight: {
    color: '#bbb',
  },
  characterCountLimitReached: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  submitButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeSection: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 15,
    marginTop: 20,
  },
  themeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  themeButtonWrapper: {
    alignSelf: 'center',
  },
  themeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    maxWidth: 90,
    transform: [{ scale: 1 }],
  },
  themeTitleContainerNight: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowOpacity: 0.4,
    shadowColor: '#000',
  },
  themeSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
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
  themeCardNight: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    shadowOpacity: 0.3,
  },
  selectedThemeCard: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowOpacity: 0.4,
    elevation: 10,
    transform: [{ scale: 1.08 }],
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  selectedThemeCardNight: {
    backgroundColor: 'rgba(60, 60, 60, 1)',
    borderColor: '#81b0ff',
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
  checkmarkContainerNight: {
    backgroundColor: '#2a2a2a',
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  themeLabelNight: {
    color: '#ccc',
  },
  selectedThemeLabel: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
  selectedThemeLabelNight: {
    color: '#fff',
  },
  fontDropdown: {
    maxHeight: 320,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  fontDropdownNight: {
    backgroundColor: 'rgba(30, 30, 30, 0.98)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowOpacity: 0.3,
  },
  fontDropdownContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  fontButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  fontButtonNight: {
    backgroundColor: 'rgba(50, 50, 50, 1)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectedFontButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    borderWidth: 2,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    transform: [{ scale: 1.05 }],
  },
  selectedFontButtonNight: {
    backgroundColor: 'rgba(129, 176, 255, 0.2)',
    borderColor: '#81b0ff',
  },
  fontButtonText: {
    fontSize: 15,
    color: '#1a1a1a',
    textAlign: 'center',
    flexShrink: 0,
  },
  fontButtonTextNight: {
    color: '#f0f0f0',
  },
  selectedFontButtonText: {
    fontWeight: '700',
  },
  fontCheckmarkContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
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
  fontCheckmarkContainerNight: {
    backgroundColor: '#81b0ff',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 40, // Extra padding on left to avoid notch/Dynamic Island
    paddingRight: 20,
    paddingBottom: 80, // Extra padding at bottom to prevent overlap with "Back to text" button
    minHeight: '100%',
  },
  scrollContentWithAnimation: {
    paddingRight: 220, // Give space for the animation when one is selected
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    alignItems: 'flex-start',
    zIndex: 20,
  },
  resultsSwitchContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  resultsSwitchText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
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
    right: 20,
    width: 200,
    height: 150,
    marginTop: -75, // Half of height to center it vertically
    zIndex: 1,
  },
  animationCenteredContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  animationCentered: {
    width: 200,
    height: 150,
  },
  fadeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  bottomSafeAreaDark: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Covers the safe area at bottom
    backgroundColor: '#000000',
    zIndex: -1,
  },
  bottomSafeAreaContainer: {
    backgroundColor: '#000000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  brushButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  brushButtonNight: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brushButtonActive: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  brushButtonActiveNight: {
    backgroundColor: 'rgba(129, 176, 255, 0.3)',
    borderColor: '#81b0ff',
  },
  drawingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  drawingTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  eraserButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  eraserButtonNight: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 15,
  },
  settingsButtonNight: {
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  settingsModalNight: {
    backgroundColor: '#1a1a1a',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingsHeaderNight: {
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  settingsTitleNight: {
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  settingsContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  settingsSectionTitleNight: {
    color: '#ffffff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  backgroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 15,
  },
  backgroundOption: {
    width: 100,
    marginBottom: 15,
    alignItems: 'center',
  },
  backgroundOptionSelected: {
    transform: [{ scale: 1.05 }],
  },
  backgroundPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  backgroundLottiePreview: {
    width: '100%',
    height: '100%',
  },
  backgroundGradientPreview: {
    width: '100%',
    height: '100%',
  },
  backgroundCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  backgroundOptionLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  backgroundOptionLabelNight: {
    color: '#ffffff',
  },
});

export default PocketSayApp;

