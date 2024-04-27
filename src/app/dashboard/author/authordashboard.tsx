"use client"

import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, IconButton, Button } from '@mui/material'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';

interface Article {
    id: number;
    title: string;
    summary: string;
    pdfLink: string;
    status: number;
    score1: null | number;
    score2: null | number;
}

export default function AuthorDashboard() {

    const { data: session } = useSession();
    const [articles, setArticles] = useState<Article[]>([])
    const router = useRouter()

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/article/user/" + session?.user.id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();
                setArticles(data)
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };

        if(session?.user.id !== undefined) {
            fetchData();
        }

    }, [session])

    function getStatusText(status: any) {
        switch (status) {
            case 0:
                return "Revisão";
            case 1:
                return "Aceito";
            case 2:
                return "Rejeitado";
            default:
                return "Desconhecido";
        }
    }

    const handleDelete = (id: number) => {
        const deleteArticle = async () => {
            try {
                await fetch("http://localhost:8000/article/" + id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });

                const newArticles = articles.filter(article => article.id !== id)
                setArticles(newArticles)
            } catch (error) {
                console.error('Erro ao deletar:', error);
            }
        };

        deleteArticle();
    }


    return (
        <>
            <Box
                sx={{
                    minHeight: '70vh',
                    padding: '50px 150px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
                    Seus artigos
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: '60vh' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Editar</TableCell>
                                <TableCell align="right">Deletar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {articles.length > 0 ? (
                                <>
                                    {articles.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.title}
                                            </TableCell>
                                            <TableCell align="right">{getStatusText(row.status)}</TableCell>
                                            <TableCell align="right"
                                                onClick={() => router.push('/dashboard/author/id:' + row.id)}
                                            ><IconButton><EditIcon sx={{color: 'black'}}/></IconButton></TableCell>
                                            <TableCell align="right"><IconButton
                                                onClick={() => handleDelete(row.id)}
                                            ><DeleteIcon color='error' /></IconButton></TableCell>
                                        </TableRow>
                                    ))}
                                </>
                            ) : null}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button sx={{
                    background: 'black',
                    color: 'white',
                    width: '30%',
                    height: '50px',
                    alignSelf: 'center',
                    '&:hover': {
                        background: (theme) => theme.palette.secondary.dark, 
                    },
                }}
                    color='secondary'
                    onClick={() => router.push('/dashboard/author/new')}
                >Criar novo artigo</Button>

            </Box>
        </>
    )
}
