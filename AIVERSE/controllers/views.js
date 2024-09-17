const path = require('path');
const express = require('express');
const { register } = require('module');
const db = require('../database/dbConnection');


const renderPage = (page) => (req, res) => {
    res.render(page);
};

const renderPageEvents = (page) => (req, res) => {
    res.render(`templates/${page}`);
};

index = renderPage('index');
explore = renderPage('explore');
team = renderPage('team');
about = renderPage('about_dept');

emperor_conquest = renderPageEvents('emperor_conquest');
giga_gen = renderPageEvents('giga_gen');
beatbots = renderPageEvents('beat_bots');
OptiML = renderPageEvents('opti_ml');
uxplore = renderPageEvents('uxplore');

reg = renderPage('reg');
payment = renderPage('payment');

registerUser = (req, res) => {
    const { name, phone, email, branch, year, event, teamSize, amount } = req.body;

    // Insert main registration data
    const registrationSql = "INSERT INTO registrations (name, phone, email, branch, year, event, teamSize, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const registrationValues = [name, phone, email, branch, year, event, teamSize, amount];

    db.query(registrationSql, registrationValues, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send('Error saving data.');
            return;
        }


        if (teamSize > 1) {
            const registrationId = results.insertId;

            // Insert team member data
            const teamMemberSql = "INSERT INTO team_members (registration_id, name, phone, email, branch, year) VALUES ?";
            const teamMemberValues = [];

            for (let i = 2; i <= teamSize; i++) {
                const memberName = req.body[`name${i}`];
                const memberPhone = req.body[`phone${i}`];
                const memberEmail = req.body[`email${i}`];
                const memberBranch = req.body[`branch${i}`];
                const memberYear = req.body[`year${i}`];
                teamMemberValues.push([registrationId, memberName, memberPhone, memberEmail, memberBranch, memberYear]);
            }
            db.query(teamMemberSql, [teamMemberValues], (err) => {
                if (err) {
                    console.error('Error inserting team members:', err);
                    res.status(500).send('Error saving team members.');
                    return;
                }
                res.send('Data saved successfully!');
            });
        }
        
        res.send('Data saved successfully!');
    });
}
module.exports = {
    index,
    explore,
    team,
    about,
    emperor_conquest,
    giga_gen,
    beatbots,
    OptiML,
    uxplore,
    reg,
    payment,
    registerUser
};
