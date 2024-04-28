"use client"

import { Tabs, Tab, Typography } from '@mui/material'
import { useState } from 'react';
import ViewAllArticle from './viewallarticle';
import EditUsers from './editusers';
import SelectArticleForPublication from './selectarticleforpuclication';


export default function AdminDashboard() {

    const [tabValues, setTabValues] = useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setTabValues(newValue);
    };

    const renderTabComponent = () => {
        switch (tabValues) {
            case 0:
                return <ViewAllArticle />
            case 1:
                return <EditUsers />
            case 2:
                return <SelectArticleForPublication />
            default:
                return null;
        }
    }

    return (
        <>
            <Tabs value={tabValues} onChange={handleChangeTab} centered>
                <Tab label={<Typography fontWeight={700}>Visualizar todos os artigos</Typography>} />
                <Tab label={<Typography fontWeight={700}>Editar usuários</Typography>} />
                <Tab label={<Typography fontWeight={700}>Selecionar artigos para publicação</Typography>} />
            </Tabs>

            {renderTabComponent()}
        </>
    )
}
