import { useMutation, useQuery } from "@apollo/client";
import React, { ChangeEvent, FormEvent, useMemo, useState } from "react";

import Resizer from "react-image-file-resizer";

import { toast } from "react-toastify";
import omitDeep from "omit-deep-lodash";

import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";

interface IImage {
  url: string;
  public_id: string;
}

interface IProfile {
  username: string;
  name: string;
  email: string;
  about: string;
  images: [IImage];
}

interface IProfileResp {
  profile: IProfile;
}

const Profile = () => {
  const [values, setValues] = useState<IProfile>({
    username: "",
    name: "",
    email: "",
    about: "",
    images: [{ url: "", public_id: "" }],
  });

  const [loading, setLoading] = useState(false);

  const { data } = useQuery<IProfileResp>(PROFILE);

  useMemo(() => {
    // Inicio da gambiarra
    let images: any;

    if (data) {
      // Retira o campo __typename da resposta
      images = omitDeep(data.profile.images, "__typename");
    }
    // fim da gambiarra

    data &&
      setValues({
        //...values,
        username: data.profile.username,
        name: data.profile.name,
        email: data.profile.email,
        about: data.profile.about,
        images,
      });
  }, [data]);

  // Mutation
  const [userUpdate] = useMutation(USER_UPDATE, {
    update: ({ data }: any) => {
      console.log("Atualização de usuário na mutation profile", data);

      toast.success(`Perfil do usuário <<${values.email}>> foi atualizado.`);
    },
  });

  // Destructure
  const { about, email, name, username } = values;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(values);

    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const fileResizeAndUpload = (event: ChangeEvent<any>) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          console.log(uri);
        },
        "base64"
      );
    }
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nome do Usuário</label>
        <input
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Nome do usuário"
          disabled={loading}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Nome</label>
        <input
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Nome"
          disabled={loading}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>E-mail</label>
        <input
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          disabled
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Imagem</label>
        <input
          onChange={fileResizeAndUpload}
          placeholder="Imagens"
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Sobre</label>
        <textarea
          name="about"
          value={about}
          onChange={handleChange}
          placeholder="Sobre"
          disabled={loading}
          className="form-control"
        />
      </div>
      <button
        type="submit"
        disabled={!email || loading}
        className="btn btn-primary"
      >
        Enviar
      </button>
    </form>
  );

  return <div className="container p-5">{profileUpdateForm()}</div>;
};

export default Profile;
