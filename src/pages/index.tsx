import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}
interface fetchImageProps {
  data: Card[];
  after: string | null;
}

export default function Home(): JSX.Element {
  async function fetchImages({ pageParam = null }): Promise<fetchImageProps> {
    if (pageParam) {
      const { data } = await api.get(`/api/images`, {
        params: {
          after: pageParam,
        },
      });

      return data;
    }

    const { data } = await api.get(`/api/images`);

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after ?? null,
  });

  const formattedData = useMemo(() => {
    const imageFiltered = data?.pages
      .map(page => {
        if (data) {
          return page?.data;
        }
      })
      .flat(2);

    return imageFiltered;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            role="button"
            marginTop="2rem"
            isLoading={isFetchingNextPage}
            loadingText="Carregando..."
            onClick={() => fetchNextPage()}
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
