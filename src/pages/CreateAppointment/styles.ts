import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { IProvider } from './index';

interface ProviderContainerProps {
  isSelected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 20px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProvidersListContainer = styled.View`
  height: 112px;
  flex: 1;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<IProvider>)`
  padding: 32px 24px;
`;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: ${props => (props.isSelected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  padding: 8px 12px;
  align-items: center;
  margin-right: 16px;
  border-radius: 10px;
  height: 72px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: #f4ede8;
`;
