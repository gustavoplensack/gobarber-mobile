/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
} from './styles';

interface IRouteParams {
  provider_id: string;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const route = useRoute();
  const { provider_id } = route.params as IRouteParams;
  const [selectedProvider, setSelectedProvider] = useState(provider_id);

  useEffect(() => {
    api.get('/providers').then(response => {
      if (response.status === 200) {
        setProviders(response.data);
      }
    });
  }, []);

  const handleSelectProvider = useCallback(
    newSelectedProvider => setSelectedProvider(newSelectedProvider),
    [setSelectedProvider],
  );

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          data={providers}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 48 }}
          removeClippedSubviews={false}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              isSelected={provider.id === selectedProvider}
              onPress={() => handleSelectProvider(provider.id)}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }} />
              <ProviderName>{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
    </Container>
  );
};

export default CreateAppointment;
