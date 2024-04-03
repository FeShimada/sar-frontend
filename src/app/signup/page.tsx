'use client'
import { Box, Typography, Grid, TextField, Button } from '@mui/material'
import { useFormik } from 'formik';
import * as Yup from "yup";
import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';


interface Client {
    email: string
    password: string
    name: string
}

export default function Home() {

    const router = useRouter()

    const handleSubmitFormik = async (values: Client) => {

        const res = await fetch("http://localhost:8000" + "/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
                role: 0
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) {
            alert(res.statusText);
            return;
        }
        const response = await res.json();
        alert("User Registered!");
        console.log({ response });
        router.push('/')
    }

    const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue, validateForm } =
        useFormik<Client>({
            validateOnBlur: true,
            validateOnChange: true,
            enableReinitialize: true,
            initialValues: {
                email: '',
                password: '',
                name: ''
            },
            validationSchema: Yup.object({
                email: Yup.string().required("Campo obrigatório!"),
                password: Yup.string().required("Campo obrigatório!"),
                name: Yup.string().required("Campo obrigatório!"),
            }),
            onSubmit: handleSubmitFormik
        })

    return (
        <>
            <Box
                sx={{
                    padding: '100px 25px 135px 25px',
                }}
            >
                <Box
                    sx={{
                        border: '0.5px solid #878787',
                        boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.05)',
                        borderRadius: '10px',
                        padding: '133px 41px'

                    }}
                >
                    <Typography variant='h3' sx={{ fontWeight: 500, marginBottom: '27px' }}>Registrar</Typography>
                    <Grid container sx={{ gap: '16px' }}>
                        <Grid item sm={12} sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                label='Nome'
                                variant={'outlined'}
                                error={(touched.name && errors.name !== undefined)}
                                helperText={(touched.name && errors.name)}
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name='name'
                            />
                        </Grid>

                        <Grid item sm={12} sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                label='E-mail'
                                variant={'outlined'}
                                error={(touched.email && errors.email !== undefined)}
                                helperText={(touched.email && errors.email)}
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name='email'
                            />
                        </Grid>
                        <Grid item sm={12} sx={{ width: '100%' }}>
                            <TextField
                                fullWidth
                                label='Senha'
                                variant={'outlined'}
                                error={(touched.password && errors.password !== undefined)}
                                helperText={(touched.password && errors.password)}
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                name='password'
                            />
                        </Grid>

                        <Grid item sm={12} sx={{ width: '100%' }}>
                            <Button
                                fullWidth
                                sx={{ height: '57px', background: 'black', color: 'white', }}
                                variant='outlined'
                                type="button"
                                onClick={(e) => handleSubmit()}
                            >Registrar</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
