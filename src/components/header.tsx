"use client"

import { Box, Typography } from '@mui/material'
import SignoutButton from './signoutbutton';
import { useSession } from 'next-auth/react';


interface HeaderPropType {
    title?: string
}

export default function Header(props: HeaderPropType) {

    const { title } = props

    const { data: session } = useSession();

    return (
        <>
            <Box sx={{
                padding: '15px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: (theme) => theme.palette.primary.main,
            }}>
                <Typography color={'white'} fontWeight={700} variant='h4'>

                    {session?.user.role === 0 ? (
                        <>
                        Bem vindo Autor {session?.user.name}
                        </>
                    ) : session?.user.role === 1 ? (
                        <>
                        Bem vindo Avaliador {session?.user.name}
                        </>
                    ) : session?.user.role === 2 ? (
                        <>
                        Bem vindo Administrador {session?.user.name}
                        </>
                    ) : null}

                </Typography>
                <SignoutButton/>
            </Box>
        </>
    )
}
