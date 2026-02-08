import stringSimilarity from 'string-similarity';


export const check = async(analysis,officialSquad)=>{
    return analysis.injuries.map((p)=>{
        const matches = stringSimilarity.findBestMatch(p.player, officialSquad);
        const bestMatch = matches.bestMatch;

        if(bestMatch.rating > 0.4){
            if(p.player!= bestMatch.target){
                injury.player = bestMatch.target;
            }
        }
        return injury;
    })
}