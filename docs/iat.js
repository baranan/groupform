define(['pipAPI', 'https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/iat8.js'], function(APIConstructor,iatExtension){
	var API = new APIConstructor();
	var global = API.getGlobal();
	
	
	return iatExtension({

		category1 : {
			name : global.domtarname,
			title : {
				media : {image : global.domtarget + '_1_s.jpg'}, //Name of the category presented in the task.
				css : {color:'#31b404','font-size':'1.8em'}, //Style of the category title.
				height : 4//Used to position the "Or" in the combined block.
			}, 
			stimulusMedia : [
    			{image : global.domtarget+'_1.jpg'}, 
    			{image : global.domtarget+'_2.jpg'}, 
    			{image : global.domtarget+'_3.jpg'},
    			{image : global.domtarget+'_4.jpg'}
			],			
			stimulusCss : {color:'#31b404','font-size':'1.8em'}
		},	
		category2 :	{
			name :  global.nondomtarname,
			title : {
				media : {image : global.nondomtarget + '_1_s.jpg'}, //Name of the category presented in the task.
				css : {color:'#31b404','font-size':'1.8em'}, //Style of the category title.
				height : 4//Used to position the "Or" in the combined block.
			}, 
			stimulusMedia : [ 
    			{image : global.nondomtarget+'_1.jpg'}, 
    			{image : global.nondomtarget+'_2.jpg'}, 
    			{image : global.nondomtarget+'_3.jpg'},
    			{image : global.nondomtarget+'_4.jpg'}
			], 
			stimulusCss : {color:'#31b404','font-size':'1.8em'}
		},

		attribute1 :
		{
			name : 'Bad words',
			title : {
				media : {word : 'Bad words'},
				css : {color:'#0000FF','font-size':'1.8em'},
				height : 4 
			},
			stimulusMedia : [ 
				{word: 'negative'},
				{word: 'bad'},
				{word: 'horrible'},
				{word: 'miserable'},
				{word: 'hideous'},
				{word: 'dreadful'},
				{word: 'painful'},
				{word: 'repulsive'},
				{word: 'awful'},
				{word: 'ugly'}
			],
			stimulusCss : {color:'#0000FF','font-size':'2.3em'}
		},
		attribute2 :
		{
			name : 'Good words',
			title : {
				media : {word : 'Good words'},
				css : {color:'#0000FF','font-size':'1.8em'},
				height : 4 
			},
			stimulusMedia : [ 
				{word: 'positive'},
				{word: 'pleasant'},
				{word: 'good'},
				{word: 'outstanding'},
				{word: 'beautiful'},
				{word: 'magnificent'},
				{word: 'marvelous'},
				{word: 'excellent'},
				{word: 'appealing'},
				{word: 'delightful'}
			],
			stimulusCss : {color:'#0000FF','font-size':'2.3em'}
		},

// modify categories-practice instructions
		instCategoriesPractice: '<div><p align="center" style="font-size:20px; font-family:arial">' +
			'<font color="#000000"><u>Part blockNum of nBlocks </u><br/><br/></p>' +
			'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
			'Put a left finger on the <b>E</b> key for photos of <font color="#336600">leftCategory</font>. ' +
			'<br/>Put a right finger on the <b>I</b> key for photos of <font color="#336600">rightCategory</font>.<br/>' +
			'Items will appear one at a time.<br/><br/>' +
			'If you make a mistake, a red <font color="#ff0000"><b>X</b></font> will appear. ' +
			'Press the other key to continue.<br/>' +
			'<u>Go as fast as you can</u> while being accurate.<br/><br/></p>'+
			'<p align="center">Press the <b>space bar</b> when you are ready to start.</font></p></div>',


		base_url : { 
			image : global.mediaURL
		} 
	});
});





