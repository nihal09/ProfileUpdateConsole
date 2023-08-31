import React, {useEffect, useState} from 'react';
import '/Users/nihal.s/Downloads/business-profile-updater/src/styles/styles.css';
import {
    Alert,
    AppBar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    InputAdornment,
    InputLabel,
    Snackbar,
    TextField, Toolbar,
    Typography
} from "@mui/material";
import {green} from "@mui/material/colors";
import {
    Business,
    Email,
    Web
} from "@mui/icons-material";

interface Address {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface TaxIdentifiers {
    pan: string;
    ein: string;
}

interface BusinessProfileUpdationTask {
    companyName: string;
    legalName: string;
    businessAddress: Address;
    legalAddress: Address;
    taxIdentifiers: TaxIdentifiers;
    email: string;
    website: string;
    userId: string | null;
    profileId: string,
    requestTime: number | null
}

export const BusinessProfileForm = ({userId, profileId}: { userId: string, profileId: string }) => {
    const [businessProfile, setBusinessProfile] = useState<BusinessProfileUpdationTask>({
        companyName: '',
        legalName: '',
        businessAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
        legalAddress: {
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
        },
        taxIdentifiers: {
            pan: '',
            ein: '',
        },
        email: '',
        website: '',
        userId: userId,
        profileId: profileId,
        requestTime: 0
    });
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [validationId, setValidationId] = React.useState("");
    const handleFormSubmit = async (event: React.FormEvent) => {
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            event.preventDefault();
            const copyBusinessProfile = businessProfile
            copyBusinessProfile.requestTime = Date.now()
            copyBusinessProfile.userId = userId
            console.log(copyBusinessProfile)
            try {
                const response = await fetch(`http://localhost:8080/api/business-profiles/update-business-profile`, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(copyBusinessProfile),
                });

                if (response.ok) {
                    response.json().then(result => setValidationId(result.validationId))
                    setOpen(true)
                    setSuccess(true);
                    setLoading(false);
                    // Success! Handle success message or redirection here
                } else {
                    setOpen(true)
                    console.log(response)
                    setSuccess(false);
                    setLoading(false);
                    //setValidationId(response.)
                    // Handle error response
                }

            } catch (error) {
                setOpen(true)
                setSuccess(false);
                setLoading(false);
                console.log(error)
                // Handle network or fetch error
            }
        }
    };


    const getProfileInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/business-profiles/get-business-profile/` + profileId, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            });

            if (response.ok) {
                response.json().then(result => {
                    setBusinessProfile((prevProfile) => ({
                        ...result,
                    }));
                })
                // Success! Handle success message or redirection here
            } else {
                console.log(response)
            }

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getProfileInfo()
    }, [])
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = event.target;
        setBusinessProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleBusinessAddressChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Address
    ) => {
        const {value} = event.target;
        setBusinessProfile((prevProfile) => ({
            ...prevProfile,
            businessAddress: {
                ...prevProfile.businessAddress,
                [field]: value,
            },
        }));
    };

    const handleLegalAddressChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Address
    ) => {
        const {value} = event.target;
        setBusinessProfile((prevProfile) => ({
            ...prevProfile,
            legalAddress: {
                ...prevProfile.businessAddress,
                [field]: value,
            },
        }));
    };

    const handleTaxIdentifiersChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof TaxIdentifiers
    ) => {
        const {value} = event.target;
        setBusinessProfile((prevProfile) => ({
            ...prevProfile,
            taxIdentifiers: {
                ...prevProfile.taxIdentifiers,
                [field]: value,
            },
        }));
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div className="form-container">
            <AppBar position="static" color={"transparent"}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Business sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: {xs: 'none', md: 'flex'},
                                fontFamily: 'Helvetica',
                                fontWeight: 600,
                                letterSpacing: '.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            BUSINESS PROFILE
                        </Typography>
                    </Toolbar>
                </Container>
            </AppBar>
            <br/>
            <form onSubmit={handleFormSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Company Name"
                                name="companyName"
                                variant="outlined"
                                className="input-field"
                                value={businessProfile.companyName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Legal Name"
                                name="legalName"
                                variant="outlined"
                                className="input-field"
                                value={businessProfile.legalName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Grid>
                </Grid>
                <InputLabel>Business Addresss</InputLabel>
                <br/>
                <div className="input-group">
                    <TextField
                        required
                        id="outlined-basic"
                        label="Business Address Line1"
                        name="businessAddressLine1"
                        variant="filled"
                        className="input-field"
                        value={businessProfile.businessAddress.addressLine1}
                        onChange={(e) => handleBusinessAddressChange(e, 'addressLine1')}
                    />
                </div>
                <div className="input-group">
                    <TextField
                        required
                        id="outlined-basic"
                        label="Business Address Line2"
                        name="businessAddressLine2"
                        variant="filled"
                        className="input-field"
                        value={businessProfile.businessAddress.addressLine2}
                        onChange={(e) => handleBusinessAddressChange(e, 'addressLine2')}
                    />
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="City"
                                name="city"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.businessAddress.city}
                                onChange={(e) => handleBusinessAddressChange(e, 'city')}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="State"
                                name="state"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.businessAddress.state}
                                onChange={(e) => handleBusinessAddressChange(e, 'state')}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Zip"
                                name="zip"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.businessAddress.zip}
                                onChange={(e) => handleBusinessAddressChange(e, 'zip')}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Country"
                                name="country"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.businessAddress.country}
                                onChange={(e) => handleBusinessAddressChange(e, 'country')}
                            />
                        </div>
                    </Grid>
                </Grid>
                <InputLabel>Legal Addresss</InputLabel>
                <br/>
                <div className="input-group">
                    <TextField
                        required
                        id="outlined-basic"
                        label="Legal Address Line1"
                        name="legalAddressLine1"
                        variant="filled"
                        className="input-field"
                        value={businessProfile.legalAddress.addressLine1}
                        onChange={(e) => handleLegalAddressChange(e, 'addressLine1')}
                    />
                </div>
                <div className="input-group">
                    <TextField
                        required
                        id="outlined-basic"
                        label="Legal Address Line2"
                        name="legalAddressLine2"
                        variant="filled"
                        className="input-field"
                        value={businessProfile.legalAddress.addressLine2}
                        onChange={(e) => handleLegalAddressChange(e, 'addressLine2')}
                    />
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="City"
                                name="city"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.legalAddress.city}
                                onChange={(e) => handleLegalAddressChange(e, 'city')}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="State"
                                name="state"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.legalAddress.state}
                                onChange={(e) => handleLegalAddressChange(e, 'state')}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Zip"
                                name="zip"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.legalAddress.zip}
                                onChange={(e) => handleLegalAddressChange(e, 'zip')}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Country"
                                name="country"
                                variant="filled"
                                className="input-field"
                                value={businessProfile.legalAddress.country}
                                onChange={(e) => handleLegalAddressChange(e, 'country')}
                            />
                        </div>
                    </Grid>
                </Grid>
                <br/>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="EIN"
                                name="ein"
                                variant="outlined"
                                className="input-field"
                                value={businessProfile.taxIdentifiers.ein}
                                onChange={(e) => handleTaxIdentifiersChange(e, "ein")}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="PAN"
                                name="ein"
                                variant="outlined"
                                className="input-field"
                                value={businessProfile.taxIdentifiers.pan}
                                onChange={(e) => handleTaxIdentifiersChange(e, "pan")}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Website"
                                name="website"
                                variant="outlined"
                                className="input-field"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Web/>
                                        </InputAdornment>
                                    ),
                                }}
                                value={businessProfile.website}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className="input-group">
                            <TextField
                                required
                                id="outlined-basic"
                                label="Email"
                                name="email"
                                variant="outlined"
                                className="input-field"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email/>
                                        </InputAdornment>
                                    ),
                                }}
                                value={businessProfile.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </Grid>
                </Grid>
                {/* Repeat for all other form fields */}
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Box sx={{m: 1, position: 'relative'}}>
                        <Button
                            type={"submit"}
                            variant="contained"
                            disabled={loading}
                        >
                            Update Profile
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={success ? "info" : "error"} sx={{width: '100%'}}>
                                {success ? "Request accepted, validation Id - " + validationId : "Request failed Please try again!"}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default BusinessProfileForm;
