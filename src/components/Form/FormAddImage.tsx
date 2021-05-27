import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

// type CreateImageFormData = {
//   title?: string;
//   description?: string;
//   url?: string;
// };

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: files => {
          const sizeFile = files[0].size / 1000000;
          const TEN_MEGABYTE = 10;

          if (sizeFile > TEN_MEGABYTE) {
            return 'O arquivo deve ser menor que 10MB';
          }
        },
        acceptedFormats: files => {
          const fileType = files[0].type.replace(/image[//]/g, '');
          const allowedFileTypes = ['jpeg', 'png', 'gif'];

          const isAllowedFileTypes = allowedFileTypes.find(allowedFileType => {
            if (allowedFileType === fileType) {
              return true;
            }
            return false;
          });

          if (!isAllowedFileTypes) {
            return 'Somente são aceitos arquivos PNG, JPEG e GIF';
          }
        },
      },
    },
    title: {
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: {
        value: true,
        message: 'Título obrigatório',
      },
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
      required: {
        value: true,
        message: 'Descrição obrigatória',
      },
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: any) => {
      try {
        const response = await api.post('/api/images', {
          title: image.title,
          description: image.description,
          url: image.url,
        });

        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada.',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });

        return;
      }

      await mutation.mutateAsync({
        title: String(data.title),
        description: String(data.description),
        url: imageUrl,
      });

      toast({
        title: 'Imagem cadastrada.',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro.',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
        role="button"
      >
        Enviar
      </Button>
    </Box>
  );
}
