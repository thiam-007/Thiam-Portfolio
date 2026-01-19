
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testApi() {
    try {
        console.log('Fetching Experiences...');
        const expRes = await axios.get(`${API_URL}/experiences`);
        const exps = expRes.data;
        if (exps.length > 0) {
            console.log('Experience[0] tags:', exps[0].tags, typeof exps[0].tags);
        } else {
            console.log('No experiences found.');
        }

        console.log('\nFetching Projects...');
        const projRes = await axios.get(`${API_URL}/projects`);
        const projects = projRes.data;
        if (projects.length > 0) {
            console.log('Project[0] tech:', projects[0].tech, typeof projects[0].tech);
        } else {
            console.log('No projects found.');
        }

        console.log('\nFetching Certifications...');
        const certRes = await axios.get(`${API_URL}/certifications`);
        const certs = certRes.data;
        if (certs.length > 0) {
            console.log('Certification[0] tags:', certs[0].tags, typeof certs[0].tags);
        } else {
            console.log('No certifications found.');
        }

    } catch (err: any) {
        console.error('API Error:', err.message);
    }
}

testApi();
