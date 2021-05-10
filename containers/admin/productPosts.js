const { graphql } = require("graphql");
const schema = require("../../graphql/schema");

module.exports = {
  getGroups: async (req, res, next) => {
    let query = `
    query{getGroups (_filter:"{\\\"deleted\\\":false}"){
        _id
        groupName
      }}
      
    `;
    graphql(schema, query).then((result) => {
      //console.log(result);
      if (result.errors) {
        //console.log(result.errors);
        res.send({
          err:
            "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.getGroups });
      }
    });
  },

  getOptions: async (req, res, next) => {
    let query = `
    query{getOptions(_filter:"{\\"deleted\\":false}"){
      _id
      optionName
      optionDisplayName
      optionDetail {
        optionDetailType
        optionDetailContent{optionDetailName}
      }
    }}
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.send({
          err:
            "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.getOptions });
      }
    });
  },
};
