import React, { useRef, useCallback } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface signUpFormInterface {
  email: string;
  name: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const mailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (data: signUpFormInterface) => {
    formRef.current?.setErrors({});
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigarório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/users', data);

      Alert.alert(
        'Cadastro realizado com suceso!',
        'Você já pode se logar no Go-Barber',
      );
      navigation.goBack();
    } catch (err) {
      const errors = getValidationErrors(err);
      formRef.current?.setErrors(errors);

      Alert.alert(
        'Impossível fazer cadastro',
        'Tentativa de fazer cadastro falhou, tente novamente.',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView enabled style={{ flex: 1 }} behavior={undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <Title>Faça seu Cadastro</Title>
            <Form ref={formRef} onSubmit={data => handleSignUp(data)}>
              <Input
                name="name"
                icon="user"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                placeholder="Nome"
                onSubmitEditing={() => mailInputRef.current?.focus()}
              />
              <Input
                ref={mailInputRef}
                name="email"
                icon="mail"
                placeholder="Email"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>
            <Button onPress={() => formRef.current?.submitForm()}>
              Crie sua conta
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignIn
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para Login</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
