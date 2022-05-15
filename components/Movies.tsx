import React, {useState} from 'react';
import {Dimensions, Image, TouchableWithoutFeedback} from 'react-native';
import {useSpring, animated} from 'react-spring';
import styled from 'styled-components/native';

const Container = styled.View`
  padding: 0px;
`;

const Label = styled.Text`
  color: #fff;
  font-size: 16px;
  margin: 0 0 5px 10px;
`;
const MovieScroll = styled.ScrollView`
  padding-left: 10px;
`;

const MoviePoster = styled.Image`
  width: ${Math.round((Dimensions.get('window').width * 28) / 100)}px;
  height: 150px;
`;

const AnimatedMoviePoster = animated(MoviePoster);

const MovieCard = styled.View`
  padding: 10px 10px 0;
`;

export type Item = {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: {
    Source: string
    Value: string
  }[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response: string
  totalSeasons?: string
};

type Movies = {
  label: string
  itens: Item[]
};

type PressMovie = {
  pressed: boolean
  index?: number
};

const Movies = (props: Movies) => {
  const {label, itens} = props;
  const [pressing, setPressedIn] = useState<PressMovie>({pressed: false});

  const translate = useSpring({
    to: {
      scale: 1.1,
    },
    from: {
      scale: 1,
    },
  });

  return (
    <Container>
      <Label>{label}</Label>
      <MovieScroll horizontal>
        {itens.map((movie, index) => {
          return (
            <MovieCard key={String(index)}>
              <TouchableWithoutFeedback
                onPressOut={() => {
                  setPressedIn({pressed: false});
                }}
                onPressIn={() => {
                  setPressedIn({pressed: true, index: index});
                }}>
                <AnimatedMoviePoster
                  // style={index === pressing.index ? {transform: [translate]} : null}
                  resizeMode="cover"
                  source={{  uri: movie.Poster }}
                />
              </TouchableWithoutFeedback>
            </MovieCard>
          );
        })}
      </MovieScroll>
    </Container>
  );
};

export default Movies;
