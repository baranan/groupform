define(['questAPI'], function(Quest){

  var API = new Quest();

  /**
   * Page prototype
   */
  API.addPagesSet('basicPage',{
		v1style: 2,
		header: 'Consent',
		decline: false,
		autoFocus:true
	});
  
    /**
   * Question prototypes
   */
   API.addQuestionsSet('basicSelect',{
    type: 'selectOne',
    autoSubmit:'true',
    maxWidth: '60%'
  });
  
   API.addSequence([{
      inherit : 'basicPage',
      questions : [{
        type: 'info',
        stem: '<div><p>Thank you very much for participating in our study! ' + 
        "We hope you'll have a pleasant time.<br/><br/>" + 
        "Studies at Project Implicit examine your attitudes, preferences and memory. " + 
        "At the end of this study, we will give you personal feedback.<br/><br/>" + 
        "Participation in this study is voluntary, " + 
        "and you may end your participation at any time by closing the study window.  " + 
        'Contact M. Navon <a href="mailto:mayanna@post.bgu.ac.il">mayanna@post.bgu.ac.il</a>, ' + 
        "if you have any questions about the study. <br/><br/>" +
        '<p><strong>Privacy Policy</strong></p>' +
        '<p>Project Implicit’s <a href="https://implicit.harvard.edu/implicit/privacy.html" target="_blank">privacy policy</a> applies to this study.</p>'+
        '<ul type="disc"><li>Data exchanged with this site are protected by SSL encryption. Project Implicit uses the same secure hypertext '+
        'transfer protocol (HTTPS) that banks use to securely transfer credit card information. </li>' + 
        '<li>Researchers will have access to the information you provided at registration. IP addresses are recorded but not accessible '+
        'to researchers. All information will be kept confidential to the extent provided by law. </li>' + 
        '<li>Data from this study may be publicly posted with identifying information removed. </li></ul>' + 
        '</p></div>'
      },
        

        // Note: Feel free to adapt language based on your consent form.
        {
            inherit : 'basicSelect',
            name: 'userconsent',
            description: '<b>Do you agree to participate?</b>',
            answers: [
                {text: 'YES, I agree to participate.', value: true},
                {text: 'NO, I do not agree to participate.', value: false}
            ]
          }
          ]
        }
    ]);
 return API.script;
});



