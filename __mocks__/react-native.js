const React = require('react');

const createComponent = (name) => (props) => React.createElement(name, props, props.children);

module.exports = {
  View: createComponent('View'),
  Text: createComponent('Text'),
  ActivityIndicator: createComponent('ActivityIndicator'),
  StyleSheet: { create: (s) => s },
  Platform: { OS: 'web', select: (obj) => obj.web ?? obj.default },
  KeyboardAvoidingView: createComponent('KeyboardAvoidingView'),
  ScrollView: createComponent('ScrollView'),
  Pressable: createComponent('Pressable'),
  TextInput: createComponent('TextInput'),
  // basic hooks/components used by RN
  SafeAreaView: createComponent('SafeAreaView'),
  Image: createComponent('Image'),
  // exports commonly used
  StatusBar: createComponent('StatusBar'),
};
