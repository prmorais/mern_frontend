import { useMutation, useQuery } from "@apollo/client";
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useMemo,
  useState,
} from "react";

import axios from "axios";
import Resizer from "react-image-file-resizer";

import { toast } from "react-toastify";
import omitDeep from "omit-deep-lodash";

import { PROFILE } from "../../graphql/queries";
import { USER_UPDATE } from "../../graphql/mutations";
import { AuthContext } from "../../context/authContext";
import {
  IImage,
  IProfile,
  IProfileResp,
} from "../../interfaces/Profile.interface";
import { UserProfile } from "../../components/forms/UserProfile";

const Profile = () => {
  const { state } = useContext(AuthContext);
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
      // console.log("Atualização de usuário na mutation profile", data);

      toast.success(`Perfil de <<${values.email}>> atualizado.`);
    },
  });

  // Destructure
  const { about, email, images, name, username } = values;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    userUpdate({ variables: { input: values } });
    setLoading(false);
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleImageRemove = (id: string) => {
    setLoading(true);

    axios
      .post(
        `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
        { public_id: id },
        {
          headers: {
            authorization: state.user.token,
          },
        }
      )
      .then((response) => {
        setLoading(false);

        let filteredImages = images.filter((item) => {
          return item.public_id !== id;
        });

        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        setLoading(false);

        toast.error("Erro ao remover imagem!");
      });
  };

  const fileResizeAndUpload = (event: ChangeEvent<any>) => {
    setLoading(true);

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
          axios
            .post<IImage>(
              `${process.env.REACT_APP_REST_ENDPOINT}/uploadimage`,
              { image: uri },
              {
                headers: {
                  authorization: state.user.token,
                },
              }
            )
            .then((response) => {
              setLoading(false);
              // console.log("Upload para Cloudinary", response);
              setValues({ ...values, images: [...images, response.data] });
            })
            .catch((err) => {
              setLoading(false);
              console.log("Upload para cloudinary falhou!");
            });
        },
        "base64"
      );
    }
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-12 pb-3">
          {loading ? (
            <h4 className="text-danger">Acessando...</h4>
          ) : (
            <h4>Perfil</h4>
          )}
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label className="btn btn-primary">
              Upload de Imagem
              <input
                hidden
                onChange={fileResizeAndUpload}
                placeholder="Imagens"
                type="file"
                accept="image/*"
                className="form-control"
              />
            </label>
          </div>
        </div>
        <div className="col-md-9">
          {images.map((image) => (
            <img
              src={image.url}
              key={image.public_id}
              alt={image.public_id}
              style={{ height: "100px" }}
              className="float-right"
              onClick={() => handleImageRemove(image.public_id)}
            />
          ))}
        </div>
      </div>
      <UserProfile
        {...values}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        loading={loading}
      />
    </div>
  );
};

export default Profile;
