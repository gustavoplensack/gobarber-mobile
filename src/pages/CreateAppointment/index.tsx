/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

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
  Title,
  Calendar,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
} from './styles';

interface IRouteParams {
  provider_id: string;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

interface IProviderDayAvailabilityItem {
  hour: number;
  availability: boolean;
}

const CreateAppointment: React.FC = () => {
  const [providers, setProviders] = useState<IProvider[]>([]);
  const { user } = useAuth();
  const { goBack } = useNavigation();

  const route = useRoute();
  const { provider_id } = route.params as IRouteParams;
  const [selectedProvider, setSelectedProvider] = useState(provider_id);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [providerDayAvailability, setProviderDayAvailability] = useState<
    IProviderDayAvailabilityItem[]
  >([]);

  useEffect(() => {
    api.get('/providers').then(response => {
      if (response.status === 200) {
        setProviders(response.data);
      }
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => setProviderDayAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const handleSelectProvider = useCallback(
    newSelectedProvider => setSelectedProvider(newSelectedProvider),
    [setSelectedProvider],
  );

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  const handleToggleDatePicker = useCallback(
    () => setShowDatePicker(state => !state),
    [],
  );

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const morningAvailability = useMemo(() => {
    return providerDayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, availability }) => {
        return {
          hour,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          availability,
        };
      });
  }, [providerDayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return providerDayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, availability }) => {
        return {
          hour,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
          availability,
        };
      });
  }, [providerDayAvailability]);

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

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenDatePickerButton onPress={() => handleToggleDatePicker()}>
          <OpenDatePickerButtonText>
            Selecionar outra data
          </OpenDatePickerButtonText>
        </OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            onChange={handleDateChanged}
            value={selectedDate}
          />
        )}
      </Calendar>

      {morningAvailability.map(({ hourFormatted }) => (
        <Title key={hourFormatted}>{hourFormatted}</Title>
      ))}

      {afternoonAvailability.map(({ hourFormatted }) => (
        <Title key={hourFormatted}>{hourFormatted}</Title>
      ))}
    </Container>
  );
};

export default CreateAppointment;
