"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Box, Typography, Grid, TextField, Button } from '@mui/material'
import { useRouter } from "next/navigation";


export default function EditarArtigo({ params }: {
    params: { slug: string }
}) {


    const { data: session } = useSession();
    const router = useRouter();
    const [selectedArticle, setSelectedArticle] = useState({
        id: 0,
        title: '',
        summary: '',
        pdfLink: '',
        status: 0,
        score1: 0,
        score2: 0
    });

    useEffect(() => {
        const fetchArticleData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/article/${parseFloat(params.slug)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();
                setSelectedArticle(data);
            } catch (error) {
                console.error('Erro ao buscar os dados do artigo:', error);
            }
        };

        if (session?.user.id !== undefined) {
            fetchArticleData();
        }
    }, [session])

    const handleSubmit = async () => {

        const { score1, score2, id } = selectedArticle;
        const newObject = { score1, score2, id };

        try {
            await fetch("http://localhost:8000/article/edit/score", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${session?.backendTokens.accessToken}`,
                },
                body: JSON.stringify(newObject)
            });
        } catch (error) {
            console.error('Erro ao salvar os dados:', error);
        }

        router.push('/dashboard');
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0px' }}>
            <Box sx={{
                background: 'white',
                width: '600px',
                height: '100%',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
            }}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Título</Typography>
                    <Typography>{selectedArticle.title}</Typography>
                </Box>

                <Box>
                    <Typography variant="h4" fontWeight={700}>Resumo</Typography>
                    <Typography>{selectedArticle.summary === "" ? "não possuí" : selectedArticle.summary}</Typography>
                </Box>

                <Box>
                    <Typography variant="h4" fontWeight={700}>PDF LINK</Typography>
                    <Typography>{selectedArticle.pdfLink === "" ? "não possuí" : selectedArticle.pdfLink}</Typography>
                </Box>

                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label='O quão relevante o artigo é? Nota de 0 a 5'
                            value={selectedArticle.score1 ? selectedArticle.score1 : ""}
                            type="number"
                            onChange={(e) => setSelectedArticle((old) => ({ ...old, score1: parseFloat(e.target.value) }))}
                        />
                    </Grid>


                </Grid>

                <Grid container>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label='Nota pessoal: Nota de 0 a 5'
                            value={selectedArticle.score2 ? selectedArticle.score2 : ""}
                            type="number"
                            onChange={(e) => setSelectedArticle((old) => ({ ...old, score2: parseFloat(e.target.value) }))}
                        />
                    </Grid>
                </Grid>

                <Button
                    onClick={handleSubmit}
                    sx={{
                        background: 'black',
                        color: 'white',
                        padding: '10px',
                        height: '100%',
                        '&:hover': {
                            background: (theme) => theme.palette.secondary.dark,
                        },
                    }}
                    fullWidth
                >Salvar</Button>
            </Box>
        </Box>
    )
}