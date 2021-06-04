/* eslint-disable camelcase */
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
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  GoBackButton,
  SignOutButton,
  ButtonBar,
} from './styles';

interface ProileFormInterface {
  email: string;
  name: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const { user, signOut, updateUser } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const { goBack, navigate } = useNavigation();

  const mailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: ProileFormInterface) => {
      formRef.current?.setErrors({});
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigarório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .required()
              .min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Confirme a nova senha'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        Alert.alert('Perfil atualizado com suceso!');
        await updateUser(response.data.user);
        goBack();
      } catch (err) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        Alert.alert('Impossível atualizar perfil, tente novamente.');
      }
    },
    [goBack, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigate('Dashboard');
  }, [navigate]);

  return (
    <KeyboardAvoidingView enabled style={{ flex: 1 }} behavior={undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <ButtonBar>
            <GoBackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </GoBackButton>
            <SignOutButton onPress={signOut}>
              <Icon name="log-out" size={24} color="#999591" />
            </SignOutButton>
          </ButtonBar>
          <UserAvatarButton>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>

          <Title>Meu perfil</Title>
          <Form
            initialData={{ name: user.name, email: user.email }}
            ref={formRef}
            onSubmit={data => handleSignUp(data)}
          >
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
              onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
            />

            <Input
              ref={oldPasswordInputRef}
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon="lock"
              placeholder="Senha Atual"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Nova Senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            <Input
              ref={confirmPasswordInputRef}
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar Senha"
              secureTextEntry
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
          </Form>
          <Button onPress={() => formRef.current?.submitForm()}>
            Confirmar Mudanças
          </Button>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
