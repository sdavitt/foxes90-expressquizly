const axios = require('axios');

// can directly export a function definition as this filename
module.exports = async (req, res) => {
    // send a post request to our login mutation providing the data from the form
    const mutation = `mutation register($email: String!, $username: String!, $password: String!){
        register(email: $email, username: $username, password: $password)
    }`
    // if the passwords dont match, send an error message and end the function
    if (req.body.password !== req.body.confirmPassword){
        res.send({ error: "Your passwords do not match!"});
        return;
    }

    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
        {
            query: mutation,
            variables: {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            }
        }, 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(data);
        const jwtToken = data.data.register;
        res.cookie('jwtToken', jwtToken, { maxAge: 900000, httpOnly: true});
        res.redirect('/');
    } catch(e) {
        console.log(e);
        res.redirect('/auth/register');
    }
}