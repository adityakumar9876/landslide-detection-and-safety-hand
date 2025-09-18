const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock database of location risk data
const locationRiskData = {
    'himalayas': {
        riskLevel: 65,
        factors: {
            temperature: -5,
            precipitation: 45,
            windSpeed: 25,
            slopeAngle: 35,
            elevation: 4000,
            activity: 'Moderate'
        },
        recommendations: [
            "Exercise caution in steep terrain",
            "Avoid avalanche-prone slopes",
            "Carry safety equipment",
            "Check local avalanche bulletin"
        ]
    },
    'alps': {
        riskLevel: 40,
        factors: {
            temperature: 2,
            precipitation: 30,
            windSpeed: 15,
            slopeAngle: 28,
            elevation: 2500,
            activity: 'Low'
        },
        recommendations: [
            "Generally safe conditions",
            "Normal precautions recommended",
            "Check weather forecast regularly"
        ]
    }
};

// API endpoint to assess location risk
app.post('/api/assess-risk', async (req, res) => {
    try {
        const { location, lat, lng } = req.body;
        
        // In a real application, this would call various APIs to get:
        // 1. Weather data
        // 2. Terrain data
        // 3. Historical avalanche/landslide data
        // 4. Seismic activity
        
        // For demo purposes, we'll return mock data
        let riskData;
        
        if (location.toLowerCase().includes('himalaya')) {
            riskData = locationRiskData.himalayas;
        } else if (location.toLowerCase().includes('alp')) {
            riskData = locationRiskData.alps;
        } else {
            // Generate random risk data for other locations
            riskData = {
                riskLevel: Math.floor(Math.random() * 100),
                factors: {
                    temperature: Math.round(-10 + Math.random() * 30),
                    precipitation: Math.round(Math.random() * 100),
                    windSpeed: Math.round(5 + Math.random() * 50),
                    slopeAngle: Math.round(10 + Math.random() * 50),
                    elevation: Math.round(500 + Math.random() * 4000),
                    activity: ['None Recent', 'Low', 'Moderate', 'High'][Math.floor(Math.random() * 4)]
                },
                recommendations: [
                    "Check local conditions before traveling",
                    "Carry appropriate safety equipment",
                    "Inform others of your itinerary"
                ]
            };
        }
        
        res.json({
            success: true,
            data: riskData
        });
    } catch (error) {
        console.error('Risk assessment error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to assess risk'
        });
    }
});

// API endpoint to generate a report
app.post('/api/generate-report', async (req, res) => {
    try {
        const { location, riskData } = req.body;
        
        // In a real application, this would generate a PDF report
        // For demo purposes, we'll just return a success message
        
        res.json({
            success: true,
            message: 'Report generated successfully',
            downloadUrl: `/reports/${Date.now()}_${location.replace(/\s+/g, '_')}.pdf`
        });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate report'
        });
    }
});

// API endpoint to get location suggestions
app.get('/api/location-suggestions', async (req, res) => {
    try {
        const { query } = req.query;
        
        // In a real application, this would call a geocoding API
        // For demo purposes, we'll return mock suggestions
        
        const suggestions = [
            'Himalayas, Nepal',
            'Swiss Alps, Switzerland',
            'Rocky Mountains, Canada',
            'Andes, Chile',
            'Mount Everest',
            'Kilimanjaro, Tanzania',
            'Mount Fuji, Japan'
        ].filter(location => 
            location.toLowerCase().includes(query.toLowerCase())
        );
        
        res.json({
            success: true,
            suggestions: suggestions.slice(0, 5) // Return top 5 results
        });
    } catch (error) {
        console.error('Suggestion error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get suggestions'
        });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});