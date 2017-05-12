package com.ihz.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Any;
import org.hibernate.annotations.AnyMetaDef;
import org.hibernate.annotations.MetaValue;

import javax.persistence.*;

@Entity
@Table(name = "notifications")
@DiscriminatorValue("Notification")
public class Notification{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Any(metaColumn = @Column(name = "notifiable_type", length = 4), fetch = FetchType.LAZY)
    @AnyMetaDef(
            idType = "int", metaType = "string",
            metaValues = {
                    @MetaValue(targetEntity = User.class, value = "user"),
            }
    )
    @JoinColumn(name = "notifiable_id")
    @JsonIgnore
    private Notifiable notifiable;


    private String data;

    public Notifiable getNotifiable() {
        return this.notifiable;
    }

    public void setNotifiable(Notifiable notifiable) {
        this.notifiable = notifiable;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
