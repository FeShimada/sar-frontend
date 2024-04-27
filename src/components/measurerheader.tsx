"use client"

import { Box, Typography } from '@mui/material'
import SignoutButton from './signoutbutton';
import { useSession } from 'next-auth/react';


interface MeasurerHeaderPropType {
    title?: string
}

export default function MeasurerHeader(props: MeasurerHeaderPropType) {

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

                    {title ? (
                        title
                    ) : (
                        <>
                        Bem vindo avaliador {session?.user.name}
                        </>
                    )}

                </Typography>
                <SignoutButton/>
            </Box>
        </>
    )
}
