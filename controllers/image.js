

const handleDetectAPI = (req, res) => {
	/* ClarifAI setup */
    const PAT = '45148ef82a8848ce9f73d68c9f0c5639';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'jackzinn';       
    const APP_ID = 'facial-recognition';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": req.body.input
                  }
              }
          }
      ]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
   };
console.log('about to fetch from Clarifai', requestOptions)
	fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
		.then(data => {console.log('returned data', data); return res.json(data) })
		.catch(err => {console.log('errored',err); res.status(400).json('Facial Detection API Error') })		
};



const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users')
		.increment('entries')
		.returning('entries')
		.where({id})
		.then(recSet => {
				res.json({'id': id, 'entries': recSet[0]?.entries});
			})
		.catch(err=>{res.status(400).json('No entries found')});
}

module.exports = {
	handleImage,
	handleDetectAPI
}