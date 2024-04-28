
import { Box, Button } from '@mui/material'
import PublishIcon from '@mui/icons-material/Publish';
import { useSession } from 'next-auth/react';


interface PublicationModal {
    selectedArticle: {
        id: number;
    }
}

export default function PublicationModal(props: PublicationModal) {

    const {selectedArticle} = props;
    const { data: session } = useSession();

    const handlePublishArticle = async () => {
        try {
            const res = await fetch(`http://localhost:8000/article/publish/${selectedArticle.id}`, {
                method: "POST",
                headers: {
                    authorization: `Bearer ${session?.backendTokens.accessToken}`,
                }
            });
            const data = await res.json();

            window.location.reload();

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    }

    return (

        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            backgroundColor: 'white',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '24px 16px',
            gap: '16px',
        }}>
            <>
                <Button
                    onClick={handlePublishArticle}
                    sx={{ width: '100% !important', height: '100% important', margin: '0px !important' }}
                    startIcon={<PublishIcon />}
                    variant="outlined"
                >Publicar artigo</Button>
            </>
        </Box>
    )
} 
