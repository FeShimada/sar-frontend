"use client"

import AdminModal from "@/components/adminModal";
import DataTable from "@/components/datatable";
import PublicationModal from "@/components/publicationmodal";
import { Box, Typography, Modal } from '@mui/material'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Article {
    id: number;
    title: string;
    summary: string;
    pdfLink: string;
    status: number;
    score1: null | number;
    score2: null | number;
    publicated: boolean;
}

export default function SelectArticleForPublication() {

    const { data: session } = useSession();
    const [articlesScored, setArticlesScored] = useState<Article[]>([]);
    const [articlesPublicated, setArticlesPublicated] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState({id: 0});
    const [ modal, setModal ] = useState({
        openModal: false
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8000/article/getall/article`, {
                    method: "GET",
                    headers: {
                        authorization: `Bearer ${session?.backendTokens.accessToken}`,
                    }
                });
                const data = await res.json();

                const scoredArticles = data.filter((article: any) => (article.score1 !== null && article.score2 !== null) && article.publicated !== true);
                const publicatedArticles = data.filter((article: any) => article.publicated === true);

                setArticlesScored(scoredArticles.map((article: any) => {
                    let newArticle = { ...article, media: ((article.score1 + article.score2) / 2) }
                    return newArticle
                }));
                setArticlesPublicated(publicatedArticles.map((article: any) => {
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
    }, [session]);

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
                        Artigos pontuados
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
                        <DataTable setSelectedArticle={setSelectedArticle} handleRowClick={() => setModal({openModal: true})} articles={articlesScored} />
                    </Box>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        color={(theme) => theme.palette.primary.main}
                        sx={{marginTop: '20px'}}
                    >
                        Artigos publicados
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
                        <DataTable publicated={true} articles={articlesPublicated} />
                    </Box>
                </Box>
            </Box>

            <Modal
                open={modal.openModal}
                onClose={() => setModal((prev) => ({ ...prev, openModal: false }))}
            >
                <>
                    <PublicationModal
                        selectedArticle={selectedArticle}
                    />
                </>
            </Modal>
        </>
    )
}
