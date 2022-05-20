import React, {Fragment, useContext, useState} from 'react';
import styled from 'styled-components/native';

import {Feather, Ionicons} from '@expo/vector-icons';
import {useSpring, animated} from 'react-spring';
import {Item} from './Movies'
import {removeItemOnList, saveItemOnList} from '../service/firestore'
import TempStore from '../navigation/tempStore'

const Container = styled.View`
  position: absolute;
  width: 100%;
  align-items: center;
  bottom: 8px;
  opacity: 1;
`;

const TitleContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;

const Title = styled.Text`
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  margin-top: 10px;
  flex-shrink: 1;
  text-align: center;
`;

const Banner = styled.Image`
  height: 100px;
`;

const Tags = styled.View`
  justify-content: center;
  margin-top: 20px;
  flex-direction: row;
`;

const MenuTag = styled.Text`
  color: #fff;
  padding: 0 8px;
  font-size: 13px;
`;

const Separator = styled.View`
  width: 3px;
  height: 3px;
  background-color: #e8e8e8;
  margin: 6px 0;
  border-radius: 3px;
`;

const MenuHero = styled.View`
  width: 90%;
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.TouchableOpacity`
  align-items: center;
`;

const TextButton = styled.Text`
  color: #fff;
  font-size: 13px;
  margin-top: 3px;
`;

const Play = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #fff;
  width: 142px;
  height: 32px;
  border-radius: 2px;
  align-items: center;
  justify-content: center;
`;

const TextButtonPlay = styled.Text`
  font-size: 15px;
  font-weight: bold;
  padding-left: 5px;
`;

type Hero = {
  item: Item
  lista: any
  onClickItem: (item: Item) => void
};

const Hero = (props: Hero) => {
  const { item, lista, callbackUpdateHome, onClickItem } = props;
  const { perfil, lg } = useContext(TempStore);
  const tipo = item.Type
  const itemSaved = !!tipo && !!lista ? lista[tipo]?.find(i => i === item.imdbID) : null
  
  const renderTags = () => {
    const tags = item.Genre
    if(!tags) return null;
    const tagsArr = tags.split(',');
    return (
      <Tags>
        {
          tagsArr.map((tag, index) => {
            if(index > 4) return null;
            return (
              <Fragment key={tag}>
                <MenuTag>{tag}</MenuTag>
                {(index !== tagsArr.length - 1 && index < 4) && <Separator />}
              </Fragment>
            )
          })
        }
      </Tags>
    )
  }
  
  return (
    <Container>
      <TitleContainer>
        <Title>{item.Title}</Title>
      </TitleContainer>
      {
        renderTags()
      }
      <MenuHero>
        <Button onPress={async () => {
          if(!!itemSaved) {
            await removeItemOnList(item, perfil, lista, callbackUpdateHome)
          } else {
            await saveItemOnList(item, perfil, lista, callbackUpdateHome)
          }
        }}>
          <Feather name={!!itemSaved ? 'check' : 'plus'} size={26} color="#FFF" />
          <TextButton>{lg.buttonsInteractive.myList}</TextButton>
        </Button>

        <Play>
          <Ionicons name="ios-play" size={26} />
          <TextButtonPlay>{lg.buttonsInteractive.watch}</TextButtonPlay>
        </Play>

        <Button
          onPress={() => onClickItem(item)}
        >
          <Feather name="info" size={22} color="#FFF" />
          <TextButton>{lg.buttonsInteractive.knowMore}</TextButton>
        </Button>
      </MenuHero>
    </Container>
  );
};

export default Hero;
