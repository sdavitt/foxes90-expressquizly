// the user has submitted the login form and wants to be authenticated
const axios = require('axios');

// can directly export a function definition as this filename
module.exports = async (req, res) => {
    // send a post request to our login mutation providing the data from the form
    const mutation = `mutation login($email: String!, $password: String!){
        login(email: $email, password: $password)
    }`
    // if we didnt receive and email or password -> go back to login page
    if (!req.body.email || !req.body.password){
        res.redirect('/auth/login');
        return
    }
    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, 
        {
            query: mutation,
            variables: {
                email: req.body.email,
                password: req.body.password
            }
        }, 
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(data);
        const jwtToken = data.data.login;
        res.cookie('jwtToken', jwtToken, { maxAge: 900000, httpOnly: true});
        res.redirect('/');
    } catch(e) {
        console.log(e.response.data.errors);
        res.redirect('/auth/login');
    }
}