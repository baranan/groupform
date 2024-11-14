
define(['questAPI'], function(quest){

	var API = new quest();
	var global = API.getGlobal();
	
    var thebvrateQ = 'How positive or negative do you think this behavior is?</br></br>';

    // for the behaviors rating questionnaire
	
	API.addQuestionsSet('basicSelect2',
	{
		type: 'selectOne',
//		style:'multiButtons',
		autoSubmit:true,
		numericValues:true,
        required:true,
        errorMsg: {
            required: "Please select an answer, or click 'decline to answer'"
        },
        help: '<%= pagesMeta.number < 3 %>',
		helpText: 'Tip: For quick response, click to select your answer, and then click again to submit.',
		answers: [
			        'Extremely negative', 
			        'very negative',
			        'Moderately negative', 
			        'Slightly negative', 
			        'Neutral', 
			        'Slightly positive', 
			        'Moderately positive', 
			        'Very positive',
			        'Extremely positive' 
		        ]
	});		

	API.addQuestionsSet('ratebvs', 
	// behaviors rating questionnaire
	[
		{inherit : 'basicSelect2',name : 'dombv1',
			stem :  thebvrateQ + global.dombvs[0].word},
		{inherit : 'basicSelect2',name : 'dombv2',
			stem :  thebvrateQ + global.dombvs[1].word},
		{inherit : 'basicSelect2',name : 'dombv3',
			stem :  thebvrateQ + global.dombvs[2].word},
		{inherit : 'basicSelect2',name : 'dombv4',
			stem :  thebvrateQ + global.dombvs[3].word},
		{inherit : 'basicSelect2',name : 'dombv5',
			stem :  thebvrateQ + global.dombvs[4].word},			
		{inherit : 'basicSelect2',name : 'dombv6',
			stem :  thebvrateQ + global.dombvs[5].word},		
		{inherit : 'basicSelect2',name : 'dombv7',
			stem :  thebvrateQ + global.dombvs[6].word},		
		{inherit : 'basicSelect2',name : 'dombv8',
			stem :  thebvrateQ + global.dombvs[7].word},		
		{inherit : 'basicSelect2',name : 'dombv9',
			stem :  thebvrateQ + global.dombvs[8].word},		
		{inherit : 'basicSelect2',name : 'dombv10',
			stem :  thebvrateQ + global.dombvs[9].word},
		{inherit : 'basicSelect2',name : 'dombv11',
			stem :  thebvrateQ + global.dombvs[10].word},
		{inherit : 'basicSelect2',name : 'dombv12',
			stem :  thebvrateQ + global.dombvs[11].word},
		{inherit : 'basicSelect2',name : 'dombv13',
			stem :  thebvrateQ + global.dombvs[12].word},
		{inherit : 'basicSelect2',name : 'dombv14',
			stem :  thebvrateQ + global.dombvs[13].word},
		{inherit : 'basicSelect2',name : 'dombv15',
			stem :  thebvrateQ + global.dombvs[14].word},
		{inherit : 'basicSelect2',name : 'dombv16',
			stem :  thebvrateQ + global.dombvs[15].word},
		{inherit : 'basicSelect2',name : 'dombv17',
			stem :  thebvrateQ + global.dombvs[16].word},
		{inherit : 'basicSelect2',name : 'dombv18',
			stem :  thebvrateQ + global.dombvs[17].word},			
		{inherit : 'basicSelect2',name : 'nondombv1',
			stem :  thebvrateQ + global.nondombvs[0].word},
		{inherit : 'basicSelect2',name : 'nondombv2',
			stem :  thebvrateQ + global.nondombvs[1].word},
		{inherit : 'basicSelect2',name : 'nondombv3',
			stem :  thebvrateQ + global.nondombvs[2].word},
		{inherit : 'basicSelect2',name : 'nondombv4',
			stem :  thebvrateQ + global.nondombvs[3].word},
		{inherit : 'basicSelect2',name : 'nondombv5',
			stem :  thebvrateQ + global.nondombvs[4].word},			
		{inherit : 'basicSelect2',name : 'nondombv6',
			stem :  thebvrateQ + global.nondombvs[5].word},		
		{inherit : 'basicSelect2',name : 'nondombv7',
			stem :  thebvrateQ + global.nondombvs[6].word},		
		{inherit : 'basicSelect2',name : 'nondombv8',
			stem :  thebvrateQ + global.nondombvs[7].word},		
		{inherit : 'basicSelect2',name : 'nondombv9',
			stem :  thebvrateQ + global.nondombvs[8].word},		
		{inherit : 'basicSelect2',name : 'nondombv10',
			stem :  thebvrateQ + global.nondombvs[9].word},
		{inherit : 'basicSelect2',name : 'nondombv11',
			stem :  thebvrateQ + global.nondombvs[10].word},
		{inherit : 'basicSelect2',name : 'nondombv12',
			stem :  thebvrateQ + global.nondombvs[11].word},
		{inherit : 'basicSelect2',name : 'nondombv13',
			stem :  thebvrateQ + global.nondombvs[12].word},
		{inherit : 'basicSelect2',name : 'nondombv14',
			stem :  thebvrateQ + global.nondombvs[13].word},
		{inherit : 'basicSelect2',name : 'nondombv15',
			stem :  thebvrateQ + global.nondombvs[14].word},
		{inherit : 'basicSelect2',name : 'nondombv16',
			stem :  thebvrateQ + global.nondombvs[15].word},
		{inherit : 'basicSelect2',name : 'nondombv17',
			stem :  thebvrateQ + global.nondombvs[16].word},
		{inherit : 'basicSelect2',name : 'nondombv18',
			stem :  thebvrateQ + global.nondombvs[17].word}			
	]);


	/**
	Pages
	**/
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 36',
//		header: 'Questionnaire',
//		headerStyle : {'font-size':'1.2em'},
		decline:true,
		v1style:2,
		numbered: false,
		noSubmit:false //Change to true if you don't want to show the submit button.
	});
	
	/**
	Sequence
	**/
	API.addSequence(
	[ 
        {
		    mixer: 'repeat',
		    times:36,
		    data: [
        	        {inherit : 'basicPage',
                    questions : {inherit:{set:'ratebvs', type:'exRandom'}}}
                ]    
        }             
    ]);       			    
    return API.script;
});













