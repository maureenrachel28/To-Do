exports.getDate=function (){


const today = new Date()
        var options={
            weekday:'long',
            day:'numeric',
            month:'long'
        };
        return today.toLocaleDateString('en-US',options);
        
        
    }

exports.getDay = function (){
        const today= new Date();
        let options={
            weekday:"long"

        }
     return today.toLocaleDateString('en-Us',options);
        
    }

    //exports shortcut-just use the exports variable!