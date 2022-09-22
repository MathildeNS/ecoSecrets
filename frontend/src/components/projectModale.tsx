import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Grid, Typography, Stack, Button, TextField, MenuItem, Divider, Dialog,  DialogActions, DialogContent, DialogTitle, IconButton, Collapse, Alert, AlertTitle, Box, ListItem } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useMainContext } from "../contexts/mainContext";
import { ProjectBase, ProjectsService } from "../client";

export default function ProjectModal (props) {
    const { updateProjects} = useMainContext();
    const [open, setOpen] = useState(false);
    const [projectData, setProjectData] = useState<ProjectBase>({ name: '', description: '', creation_date: '', protocole: '', targeted_species: '', owner_id: 1, contact_id: 1});
    const[startDate, setStartDate] = useState<Date | null>(null);
    const[endDate, setEndDate] = useState<Date | null>(null);
    const protocoles = ["Protocole A", "Protocole B", "Protocole C"];
    const species = ["Loup", "Coccinelle", "Ours", "Chamois", "Chevreuil", "Cerf", "Marmotte", "Renard", "Aigle"];
    
    const handleClickOpen = () => {
      setOpen(true);
  
    };

    const handleFormChange = (params:string,  e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
        let tmp_project_data = {...projectData};
        tmp_project_data[params] = e.target.value;
        setProjectData(tmp_project_data);
      }

    const handleChangeDate =(params:string,  d: Date | null ) => {
        let tmp_project_data = {...projectData};
        d !== null && (tmp_project_data[params] = d.toISOString().slice(0, 10));
        setProjectData(tmp_project_data);
    }
    
    const handleClose = () => {
        setOpen(false);
        setProjectData({ name: '', description: '', creation_date: '', protocole: '', targeted_species: '', owner_id: 1, contact_id: 1});
        setStartDate(null);
        setEndDate(null);
      };
    const navigate = useNavigate();
    const save = () => {
        const maDate = new Date()
        const data = {...projectData}
        data['creation_date'] = maDate.toISOString().slice(0, 10)
        ProjectsService.createProjectProjectsPost(data).then((p) => {
            updateProjects();
            setOpen(false);
            navigate(`/projectsheet/${p.id}`)
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <Grid>

        { props.page == 'home' ?
        <Button 
              variant="contained" 
              startIcon={<AddCircleIcon />} 
              color='secondary'
              onClick={handleClickOpen}
            >
              Nouveau projet
        </Button>
        : 
        <IconButton onClick ={handleClickOpen} aria-label="menu" color='primary' sx={{ mr: 2 }}>
            <AddCircleIcon />
        </IconButton>
        }

        <Dialog open={open} onClose={handleClose}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
            >
                <DialogTitle>
                <Typography variant="h6">
                    Nouveau projet
                </Typography>
                </DialogTitle>
                <IconButton onClick = {handleClose} >
                    <ClearTwoToneIcon/>
                </IconButton>
                </Stack>
                <Divider />
                <DialogContent>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                    </Grid>
                    <Grid item lg={12}>
                    <TextField 
                        id="name"
                        name="name"
                        label="Nom"
                        value ={projectData.name}
                        onChange={(e) => handleFormChange("name", e)}
                        fullWidth 
                        required
                        variant="filled" 
                    />
                    </Grid>
                    <Grid item lg={6}>
                        <TextField
                        select 
                        label="Protocole" 
                        variant="filled"
                        value={projectData.protocole}
                        fullWidth
                        onChange={(e) => handleFormChange("protocole", e)}
                        >
                        {protocoles.map((item) => (
                            <MenuItem key={item} value={item}>
                            {item}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid>
                    <Grid item lg={6}>
                    <TextField 
                        label='Espèce cible'
                        id="targetedSpecies"
                        select
                        value={projectData.targeted_species}
                        fullWidth 
                        variant="filled"
                        onChange={(e) => handleFormChange("targeted_species", e)}
                        
                    >
                        {species.map((item) => (
                            <MenuItem key={item} value={item}>
                            {item}
                            </MenuItem>
                        ))}
                    </TextField>
                    </Grid>
                        
                    <Grid item lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                        inputFormat="dd/MM/yyyy"
                        label="Date de début"
                        value={startDate}
                        onChange={(startDate) => {
                            setStartDate(startDate);
                            handleChangeDate("start_date", startDate);
                        }}
                        renderInput={(params) => <TextField {...params} variant="filled" />}
                        />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                        inputFormat="dd/MM/yyyy"
                        label="Date de fin"
                        value={endDate}
                        onChange={(endDate) => {
                            setEndDate(endDate);
                            handleChangeDate("end_date", endDate);
                        }}
                        renderInput={(params) => <TextField {...params} variant="filled"/>}
                        />
                    </LocalizationProvider>
                    </Grid>
                    <Grid item lg={12}>
                    <TextField 
                        id="description"
                        name="description"
                        label="Description"
                        value ={projectData.description}
                        onChange={(e) => handleFormChange("description", e)}
                        fullWidth 
                        variant="filled" 
                    />
                    </Grid>
                </Grid>
                </DialogContent>
                <Divider />
                <DialogActions>
                <Button onClick={save} style={{color: "#2FA37C"}}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}