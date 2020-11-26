import React from 'react';
import { IImageProps } from '../interfaces/Profile.interface';

const Image = ({ image, handleImageRemove }: IImageProps) => (
  <img
    src={image.url}
    alt={image.public_id}
    style={{ height: '100px' }}
    className="float-right"
    onClick={() => handleImageRemove(image.public_id)}
  />
);

export default Image;
