/* The script wrapper */
define(['pipAPI'], function(APIConstructor) {
	var API = new APIConstructor();
	var global = API.getGlobal();
	
	var genref = 'his';
	if (global.socialgroup == "gender") {
	    genref = 'his/her';
	}

	/***********************************************
	// Settings
	***********************************************/
	API.addSettings('canvas',{
		maxWidth: 820,
		proportions : 0.65,
		background: '#ffffff',
		borderWidth: 5,
		canvasBackground: '#ffffff',
		borderColor: 'lightblue'
	});

	//the source of the images
	API.addSettings('base_url',{
		image : global.mediaURL
	});

	/***********************************************
	// Trials
	***********************************************/
	
	/***********************************************
                	// BASIC TRIAL
	***********************************************/
		
	// The behavior trial.
	API.addTrialSets('bv',
	{
		data : {condition:'basic', score:0, block:1},
		//Inputs for skipping.
		input: [
			{handle:'skip1',on:'keypressed', key:27} //Esc + Enter will skip blocks
		],
		interactions: [
			{ // begin trial
				conditions: [{type:'begin'}],
				actions: [ //Show the name image and behavior for 5000 ms.
					{type:'showStim',handle:'image'}, 
					{type:'showStim',handle:'behavior'}, 
					{type:'trigger',handle:'hideBV', duration:5000}
				]
			}, 
			{//Hide all the stimuli
				conditions: [{type:'inputEquals',value:'hideBV'}],
				actions: [
					{type:'hideStim',handle:'All'}, 
					{type:'log'}, 
					{type:'trigger',handle:'endTrial', duration:750}
				]
			}, 
			// skip block
			{
				conditions: [{type:'inputEquals',value:'skip1'}],
				actions: [
					{type:'setInput',input:{handle:'skip2', on:'enter'}} // allow skipping if next key is enter.
				]
			},
			// skip block
			{
				conditions: [{type:'inputEquals',value:'skip2'}],
				actions: [
					{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
					{type:'endTrial'}
				]
			},
			{//End the trial
				conditions: [{type:'inputEquals',value:'endTrial'}],
				actions: [
					{type:'endTrial'}				
				]
			}
		],
		stimuli : [	
		    //These stimuli are the default stimli and we will replace them when inheriting this basic trial.
			{inherit:'behavior'}, 
			{inherit:'image'}
		]
	});
	
	/***********************************************
                	// TASK TRIALS: Block 1
	***********************************************/    

	//Create the trials for the 2 men.
	
    /// dom
	API.addTrialSets('domtrial',{ 
	    inherit :'bv', 
	    data : {condition:'domtrial'},
	    stimuli : [
	        {inherit:'dombehaviors'},
	        {inherit : 'domface'}
	    ]
	});
    /// nondom
		API.addTrialSets('nondomtrial',{ 
	    inherit :'bv', 
	    data : {condition:'nondomtrial'},
	    stimuli : [
	        {inherit:'nondombehaviors'},
	        {inherit : 'nondomface'}
	    ]
	});
 

	/***********************************************
                	// INSTRUCTIONS TRIAL
	***********************************************/    

	//Define the instructions trial
	API.addTrialSets('inst',{
		input: [
			{handle:'space',on:'space'} //Will handle a SPACEBAR response
		],
		interactions: [
			{ // begin trial
				conditions: [{type:'begin'}],
				actions: [{type:'showStim',handle:'All'}] //Show the instructions
			},
			{
				conditions: [{type:'inputEquals',value:'space'}], //What to do when space is pressed
				actions: [
					{type:'hideStim',handle:'All'}, //Hide the instructions
					{type:'log'}, //Hide the instructions
					{type:'setInput',input:{handle:'endTrial', on:'timeout',duration:500}}// on:'timeout',duration:500 //In 500ms: end the trial. In the mean time, we get a blank screen.
				]
			},
			{
				conditions: [{type:'inputEquals',value:'endTrial'}], //What to do when endTrial is called.
				actions: [
					{type:'endTrial'} //End the trial
				]
			}
		],
		//Dummy stimulus for logging
		stimuli : [	
			{data : {alias:'dummy', handle:'dummy'}, media : {word:'dummy'}, css:{color:'#ffffff','font-size':'0em'}},
			{media:{html: '<%=trialData.instHTML%>'}, nolog:true}
		]
	});


	/***********************************************
	// Stimuli
	***********************************************/
	API.addStimulusSets({
	//These are different types of stimuli.
	//That way we can later create a stimulus object the inherits from this set randomly.

		// This Default stimulus is inherited by the other stimuli so that we can have a consistent look and change it from one place
		defaultStim: [{css:{color:'#000000','font-size':'2em'}}],
		image : [{ //general
			inherit:'defaultStim', data:{handle:'image'}, location:{top:13}
		}],
		behavior : [{ // general
			inherit:'defaultStim', data:{handle:'behavior', alias:'behavior'}, location:{top:60}//45
		}],	
		
		dombehaviors : [{ // dom target behaviors
			inherit:'behavior', data:{alias:'dombehaviors'}, 
			media: {
				inherit:{set:'dbvs', type:'exRandom'}
			} 
		}],
		nondombehaviors : [{ // nondom target behaviors
			inherit:'behavior', data:{alias:'nondombehaviors'}, 
			media: {
				inherit:{set:'ndbvs', type:'exRandom'}
			} 
		}],

		domface : [{ // dom face
			inherit:'image', data:{alias:'domface'},
			media: {
			image : global.domtarget + '_1.jpg'
			}
		}],
		nondomface : [{ // black face
			inherit:'image', data:{alias:'nondomface'},
			media: {
			image : global.nondomtarget + '_1.jpg'
			}
		}]
    	}); 

	/***********************************************
	// Create media
	***********************************************/
// group behaviors
	API.addMediaSets({
		dbvs : global.dombvs,
		ndbvs : global.nondombvs
	}); 
	
	/***********************************************/
	// Create trial sequence
	/***********************************************/
	API.addSequence([
		{ //Instructions
			inherit : "inst", 
			data: {
				blockStart:true,
				block : 1, 
			instHTML : '<div><p style="font-size:20px; text-align:left; margin-left:10px; font-family:arial"><color="FFFFFF">' + 
                                        					'Next, you will meet the two individuals and learn about some of their behaviors.<br/><br/>' +
                                        					'Remember, your task is to form an impression of each individual.<br/>' + 
                                        					'Later, we will ask you what you feel about them.<br/><br/>' +
                                                            "Each screen, showing an individual's face and behavior will appear for 5 seconds, " +
                                                            'and then the next screen will appear automatically. You will not have to press any key. <br/> <br/>' + 
                                        					'Please press SPACE to start the task.</p></div>' 
        			}
		},
        {
		    mixer: 'branch',
                conditions: [
                    {compare: 'global.targetPresOrder', to: 'domfirst'}
                ],
                data: [
                        {
                            mixer: 'wrapper',
                            data: [
                                     {
                                        mixer: 'repeat',
                                        times: 18,
                                        data: [
                                                {inherit:'domtrial'}
                                              ]
                                     }                                 
                                ]
                        },
                        {
                            mixer: 'wrapper',
                            data: [
                                     {
                                        mixer: 'repeat',
                                        times: 18,
                                        data: [
                                                {inherit:'nondomtrial'}
                                              ]
                                     }                                 
                                ]
                        }  
                ],
                elseData: [
                            {
                                mixer: 'wrapper',
                                data: [
                                         {
                                            mixer: 'repeat',
                                            times: 18,
                                            data: [
                                                    {inherit:'nondomtrial'}
                                                  ]
                                         }                                 
                                    ]
                            },
                            {
                                mixer: 'wrapper',
                                data: [
                                         {
                                            mixer: 'repeat',
                                            times: 18,
                                            data: [
                                                    {inherit:'domtrial'}
                                                  ]
                                         }                                 
                                    ]
                            }       
                ]
        },    
		{
			inherit:'inst', 
			data: {
				blockStart:true, 
				block:1, 
				instHTML:'<div><p style="font-size:28px"><color="#FFFFFF">You have completed this part<br/><br/>Press SPACE to continue.</p></div>'
			}
		}
	]);
	
	return API.script;
});







