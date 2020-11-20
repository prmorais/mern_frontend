import { ChangeEvent, FormEvent } from "react";

export interface IImage {
	url: string;
	public_id: string;
}

export interface IProfile {
	username: string;
	name: string;
	email: string;
	about: string;
	images: Array<IImage>;
}

export interface IProfileResp {
	profile: IProfile;
}

export interface IUserProfile {
	username: string;
	name: string;
	email: string;
	about: string;
	handleChange: (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
	loading: boolean;
}