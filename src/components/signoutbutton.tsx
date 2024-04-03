"use client"

import theme from '@/styles/theme'
import { Button } from '@mui/material'
import { signOut } from 'next-auth/react'

export default function SignoutButton() {


    return (
        <>
            <Button
                sx={{
                    background: (theme) => theme.palette.secondary.main,
                    color: 'white',
                    '&:hover': {
                        background: (theme) => theme.palette.secondary.dark, 
                    },
                    width: '100px'
                }}
                onClick={() => signOut()}
                size='large'
            >
                Sair
            </Button>
        </>
    )
}
