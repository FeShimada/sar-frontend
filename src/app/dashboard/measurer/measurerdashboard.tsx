"use client"

import DataTable from "@/components/datatable";
import { Box, Typography } from '@mui/material'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function MeasurerDashboard() {

    const { data: session } = useSession();
    const [ articlesUnscored, setArticlesUnscored ] = useState([]);
    const [ articlesScored, setArticlesScored ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/article/user/${session?.user.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();

                const unscoredArticles = data.filter((article: any) => article.score1 === null || article.score2 === null);
                const scoredArticles = data.filter((article: any) => article.score1 !== null && article.score2 !== null);

                setArticlesUnscored(unscoredArticles.map((article: any) => {
                    let newArticle = { ...article, media: ((article.score1 + article.score2) / 2) }
                    return newArticle
                }));
                setArticlesScored(scoredArticles.map((article: any) => {
                    let newArticle = { ...article, media: ((article.score1 + article.score2) / 2) }
                    return newArticle
                }));
            } catch (error) {
                console.error('Erro ao buscar os dados:', error);
            }
        };
        if (session?.user.id !== undefined) {
            fetchData();
        }
    }, [session])

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '50%'
                }}
            >
                <Box
                    sx={{
                        padding: '22px 0px 89px 0px',
                        width: '1009px'
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color={(theme) => theme.palette.primary.main}
                    >
                        Artigos não avaliados
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            background: 'white',
                            padding: '24px 28px 38px 28px',
                            borderRadius: '8px',
                            marginTop: '26px'
                        }}
                    >
                        <DataTable articles={articlesUnscored} />
                    </Box>
                </Box>

                <Box
                    sx={{
                        padding: '22px 0px 89px 0px',
                        width: '1009px'
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color={(theme) => theme.palette.primary.main}
                    >
                        Artigos avaliados
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            background: 'white',
                            padding: '24px 28px 38px 28px',
                            borderRadius: '8px',
                            marginTop: '26px'
                        }}
                    >
                        <DataTable articles={articlesScored} />
                    </Box>
                </Box>
            </Box>
        </>
    )
}
