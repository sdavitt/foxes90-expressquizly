module.exports = (req, res) => {
    console.log('Logout...');
    res.cookie('jwtToken', '', { maxAge: 900000, httpOnly: true});
    res.redirect('/auth/login');
}