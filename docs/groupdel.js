
define(['questAPI'], function(quest){

	var API = new quest();
	var global = API.getGlobal();


    // adjectives
    var negAdj = API.shuffle(['negative', 'horrible', 'miserable', 'hideous', 'dreadful', 'painful', 'repulsive', 'awful', 'ugly']);
    var posAdj = API.shuffle(['positive', 'pleasant', 'outstanding', 'beautiful', 'magnificent', 'marvelous', 'excellent', 'appealing', 'delightful', 'nice']);
    var adj1 = 'good';
    var adj2 = 'bad';
    var adj3 = posAdj[0];
    var adj4 = posAdj[1];
    var adj5 = negAdj[0];
    var adj6 = negAdj[1];
	
	/**
	Question-prototypes
	**/
	API.addQuestionsSet('basicSelect',
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
			        'Extremely uncharacteristic', 
			        'Moderately uncharacteristic', 
			        'Slightly uncharacteristic', 
			        'Slightly characteristic', 
			        'Moderately characteristic', 
			        'Extremely characteristic' 
		        ]		
	});

	
	/**
	 questionnaires
	 **/
    
	API.addQuestionsSet('rategroups', 
	[
		{
			inherit : 'basicSelect',
			name : 'dom.'+adj1,
			stem : 'How much do you think that the word ' + adj1 + ' is characteristic of the average <%=global.domcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'dom.'+adj2,
			stem : 'How much do you think that the word ' + adj2 + ' is characteristic of the average <%=global.domcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'dom.'+adj3,
			stem : 'How much do you think that the word ' + adj3 + ' is characteristic of the average <%=global.domcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'dom.'+adj4,
			stem : 'How much do you think that the word ' + adj4 + ' is characteristic of the average <%=global.domcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'dom.'+adj5,
			stem : 'How much do you think that the word ' + adj5 + ' is characteristic of the average <%=global.domcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'dom.'+adj6,
			stem : 'How much do you think that the word ' + adj6 + ' is characteristic of the average <%=global.domcat%>?'
		},		
		{
			inherit : 'basicSelect',
			name : 'nondom.'+adj1,
			stem : 'How much do you think that the word ' + adj1 + ' is characteristic of the average <%=global.nondomcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'nondom.'+adj2,
			stem : 'How much do you think that the word ' + adj2 + ' is characteristic of the average <%=global.nondomcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'nondom.'+adj3,
			stem : 'How much do you think that the word ' + adj3 + ' is characteristic of the average <%=global.nondomcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'nondom.'+adj4,
			stem : 'How much do you think that the word ' + adj4 + ' is characteristic of the average <%=global.nondomcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'nondom.'+adj5,
			stem : 'How much do you think that the word ' + adj5 + ' is characteristic of the average <%=global.nondomcat%>?'
		},
		{
			inherit : 'basicSelect',
			name : 'nondom.'+adj6,
			stem : 'How much do you think that the word ' + adj6 + ' is characteristic of the average <%=global.nondomcat%>?'
		}		
	]);


	/**
	Pages
	**/
	API.addPagesSet('basicPage',
	{
		progressBar: '<%= pagesMeta.number %> out of 12',
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
		    times:12,
		    data: [
        	        {inherit : 'basicPage',
                    questions : {inherit:{set:'rategroups', type:'exRandom'}}}
                ]    
        }             
    ]);       			    
    return API.script;
});














