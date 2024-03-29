import {create} from "zustand";
import {Channel, ChannelType, Server} from "@prisma/client";

export type ModalType = 'createServer' | 'invite' | 'editServer' | 'members'
	| 'createChannel' | 'leaveServer' | 'deleteServer' | 'deleteChannel' | 'editChannel' | 'messageFile';
interface ModalStore {
	type: ModalType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?:ModalData) => void;
	onClose: () => void;
}
interface ModalData {
	server?:Server;
	channelType?: ChannelType;
	channel?: Channel;
	apiUrl?: string;
	query?: Record<string, any>
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data : {},
	isOpen: false,
	onOpen: (type, data={}) => set({type, isOpen: true, data}),
	onClose: () => set({type: null, isOpen: false}),
}));