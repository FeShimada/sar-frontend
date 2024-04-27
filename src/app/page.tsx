'use client'
import { Box, Typography, Grid, TextField, Button } from '@mui/material'
import { useFormik } from 'formik';
import * as Yup from "yup";
import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";


interface ClientLogin {
  email: string
  password: string
}

export default function Home() {

  const { data: session } = useSession();
  const router = useRouter()

  if (session && session.user) {
    router.push('/dashboard')
  }

  const searchParams = useSearchParams()
  const errorSignIn = searchParams.get('error')


  const handleSubmitFormik = async (values: ClientLogin) => {
    await signIn('credentials', {
      ...values,
      redirect: true,
      callbackUrl: '/dashboard'
    })
  }

  const { values, errors, touched, handleBlur, handleSubmit, handleChange, setFieldValue, validateForm } =
    useFormik<ClientLogin>({
      validateOnBlur: true,
      validateOnChange: true,
      enableReinitialize: true,
      initialValues: {
        email: '',
        password: ''
      },
      validationSchema: Yup.object({
        email: Yup.string().required("Campo obrigatório!"),
        password: Yup.string().required("Campo obrigatório!"),
      }),
      onSubmit: handleSubmitFormik
    })

  return (
    <>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <Box
            sx={{
              border: '0.5px solid #878787',
              boxShadow: '0px 4px 64px rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
              padding: '133px 41px',
            }}
          >
            <Typography variant='h3' sx={{ fontWeight: 500, marginBottom: '27px' }}>Entrar</Typography>
            <Grid container sx={{ gap: '16px' }}>
              <Grid item sm={12} sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label='E-mail'
                  variant={'outlined'}
                  error={(touched.email && errors.email !== undefined) || errorSignIn !== null}
                  helperText={(touched.email && errors.email) || (errorSignIn && 'Credenciais inválidas')}
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
                  error={(touched.password && errors.password !== undefined) || errorSignIn !== null}
                  helperText={(touched.password && errors.password) || (errorSignIn && 'Credenciais inválidas')}
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name='password'
                />
              </Grid>

              <Grid item sm={12} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Button
                  fullWidth
                  sx={{
                    height: '57px', background: 'black', color: 'white', '&:hover': {
                      background: (theme) => theme.palette.secondary.dark,
                    },
                  }}
                  variant='outlined'
                  type="button"
                  onClick={(e) => handleSubmit()}
                  color='primary'
                >Entrar</Button>
                <Button sx={{ color: 'black' }} onClick={() => router.push('/signup')}>Registrar</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
}
