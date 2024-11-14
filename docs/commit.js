//This page prompts participants to type that they will complete the study with their full attention.
//This approach has been shown to reduce drop-outs in online studies (Zhou & Fishbach, 2016 - experiment 4)

define(['questAPI'], function(quest){
	var API = new quest();
	var global = API.getGlobal();
	
	API.addQuestionsSet({
		commit: [		{						
		    type:'text',						
		    name: 'commit',
		    required: true,
		    minlength: 27, //This is the length of the phrase they have to type. Including this means that if they type left, a prompt will appear.
		    maxWidth: 100, //modify the stem below to describe how long the study will take and potentially describe what the study involves
			stem: '<div id="scoped-content"><style type="text/css" scoped>h1 { font-size:1.2em; }</style>' + 
			global.introText +
			'<br/><br/>'+
			'Many people may be tempted to visit other web pages while taking the study<b>. ' + 
			'If a lot of people browse other pages or do other things during the study, the study&#39;s data won&#39;t be usable. ' + 
			'However, our research depends on good quality data.</b> ' + 
			'So, please make sure you are willing to sit through the study before starting it.<br/><br/>' + 
			'If you would like to participate, please type this exact sentence into the box below: ' + 
			'&quot;<b>I will complete this study with my full attention.</b>&quot; and press &quot;Submit&quot;.</h1></div>',
		    errorMsg: {
                        required: 'It is important that you commit to completing the study with your full attention. ' + 
                        'If you are unable or unwilling to do so, please return to the study later when you are able to.'
            }
		    }]
	});	

	API.addPagesSet('BasicPage',{
		noSubmit:false, 
		v1style: 2,
		numbered: false,
		headerStyle: {'font-size':'1em'}
	});	

    API.addSequence([
		{			inherit:'BasicPage', questions: {inherit:{set:'commit'}} }
	]);

	return API.script;
});









