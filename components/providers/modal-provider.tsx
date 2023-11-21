'use client';

import React from 'react';
import {useEffect, useState} from "react";
import {CreateServerModal} from "@/components/modals/create-server-modal";
import {InviteModal} from "@/components/modals/invite-modal";

const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, [])
	if (!isMounted) {
		return null;
	}
	return (
		<>
			<CreateServerModal/>
			<InviteModal/>
		</>
	);
};

export default ModalProvider;