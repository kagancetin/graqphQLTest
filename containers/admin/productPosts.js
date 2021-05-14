const { graphql } = require("graphql");
const schema = require("../../graphql/schema");
const { Product } = require("../../models");

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
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
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
        optionType
        optionDetail {
          optionDetailContent
          optionPriceDifference
        }
      }
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.getOptions });
      }
    });
  },

  addOption: async (req, res, next) => {
    let optionDetailString = "[";
    req.body.optionDetail.forEach((p) => {
      optionDetailString += `{optionDetailContent:"${p.optionDetailContent}",optionPriceDifference:${p.optionPriceDifference}},`;
    });
    optionDetailString += "]";
    let query = `
    mutation{
      addOption(
        optionName:"${req.body.optionName}",
        optionDisplayName:"${req.body.optionDisplayName}"
        optionType:${req.body.optionType},
        optionDetail:${optionDetailString}
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.addOption });
      }
    });
  },
  editOption: async (req, res, next) => {
    let optionDetailString = "[";
    req.body.optionDetail.forEach((p) => {
      optionDetailString += `{optionDetailContent:"${p.optionDetailContent}",optionPriceDifference:${p.optionPriceDifference}},`;
    });
    optionDetailString += "]";
    let query = `
    mutation{
      editOption(
        _id:"${req.body._id}",
        optionName:"${req.body.optionName}",
        optionDisplayName:"${req.body.optionDisplayName}"
        optionType:${req.body.optionType},
        optionDetail:${optionDetailString}
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.editOption });
      }
    });
  },
  removeOption: async (req, res, next) => {
    let optionId = req.body.optionId;
    let products = await Product.find({
      options: optionId,
    });
    if (products.length > 0) {
      res.send({
        err: "Bu seçeneği ürünlede kullandığınız için silemezsiniz. Öncelikle ürünlerden kaldırınız!",
      });
    } else {
      let query = `
      mutation{removeAndRestoreOption(_id:"${optionId}")}
      `;
      graphql(schema, query).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          res.send({
            err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
          });
        } else {
          res.send({ err: null, data: result.data.removeAndRestoreOption });
        }
      });
    }
  },
  addGroup: async (req, res, next) => {
    let query = `
    mutation{
      addGroup(groupName:"${req.body.groupName}",order:${req.body.order})
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.addGroup });
      }
    });
  },
  editGroup: async (req, res, next) => {
    console.log(req.body.order);
    let query = `
    mutation{
      editGroup(_id:"${req.body.id}",groupName:"${req.body.groupName}",order:${req.body.order})
    } 
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", "Grup başarıyla güncellendi.");
        res.send({ err: null });
      }
    });
  },
  removeGroup: async (req, res, next) => {
    console.log(req.body);
    let query = `
    mutation{
      removeAndRestoreGroup(_id:"${req.body.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.removeAndRestoreGroup);
        res.send({ err: null });
      }
    });
  },
};
